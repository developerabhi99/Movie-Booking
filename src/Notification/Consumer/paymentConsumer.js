const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");
const { handleNotification } = require("../../services/Notifications/notificationService");

const QUEUE_NAME = "Payment_Queue";
const MAX_RETRIES = 6;

// Retry timings
const RETRY_DELAYS = [5000, 10000, 20000, 40000, 80000, 160000];

async function PaymentConsumer() {
  try {
    const { channel } = await initRabbitMQ();
    console.log("Listening to:", QUEUE_NAME);

    // MAIN QUEUE (first receiver)
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
        "x-dead-letter-routing-key": "Payment.retry.1" // First retry step
      }
    });

    await channel.bindQueue(QUEUE_NAME, NOTIFICATION_EXCHANGE, "Payment.main");

    // RETRY QUEUES
    for (let i = 0; i < MAX_RETRIES; i++) {
      const retryQueue = `Payment_Retry_Queue_${i + 1}`;
      const ttl = RETRY_DELAYS[i];
      const nextRetryRoutingKey = (i + 1 < MAX_RETRIES)
        ? `Payment.retry.${i + 2}`
        : "Payment.dlq"; // Last retry sends to DLQ

      await channel.assertQueue(retryQueue, {
        durable: true,
        arguments: {
          "x-message-ttl": ttl,
          "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
          "x-dead-letter-routing-key": nextRetryRoutingKey
        }
      });

      // Bind retry queue to receive retry messages
      await channel.bindQueue(retryQueue, NOTIFICATION_EXCHANGE, `Payment.retry.${i + 1}`);
    }

    // DLQ
    await channel.assertQueue("Payment_DLQ", { durable: true });
    await channel.bindQueue("Payment_DLQ", NOTIFICATION_EXCHANGE, "Payment.dlq");

    // CONSUMER
    await channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const body = JSON.parse(msg.content.toString());
      const retryCount = msg.properties.headers?.["x-retry-count"] || 0;

      try {
        await handleNotification(body.type, body.messageType, body.message);

        console.log(`✅ Processed successfully`);
        channel.ack(msg);

      } catch (err) {
        console.error(`❌ Failed (Attempt ${retryCount + 1}):`, err.message);

        // Send to next retry queue OR DLQ
        const nextRetryRoutingKey = (retryCount < MAX_RETRIES)
          ? `Payment.retry.${retryCount + 1}`
          : "Payment.dlq";

        channel.publish(
          NOTIFICATION_EXCHANGE,
          nextRetryRoutingKey,
          Buffer.from(JSON.stringify(body)),
          { persistent: true, headers: { "x-retry-count": retryCount + 1 } }
        );

        console.log(`↪️ Routed to: ${nextRetryRoutingKey}`);
        channel.ack(msg);
      }
    });

  } catch (err) {
    console.error("Consumer Initialization Error:", err.message);
  }
}

module.exports = { PaymentConsumer };
