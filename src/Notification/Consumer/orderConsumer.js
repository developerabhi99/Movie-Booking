const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");
const { handleNotification } = require("../../services/Notifications/notificationService");

const QUEUE_NAME = "Order_Queue";
const MAX_RETRIES = 6;

// Retry timings
const RETRY_DELAYS = [5000, 10000, 20000, 40000, 80000, 160000];

async function OrderConsumer() {
  try {
    const { channel } = await initRabbitMQ();
    console.log("Listening to:", QUEUE_NAME);

    // MAIN QUEUE (first receiver)
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
        "x-dead-letter-routing-key": "Order.retry.1" // First retry step
      }
    });

    await channel.bindQueue(QUEUE_NAME, NOTIFICATION_EXCHANGE, "Order.main");

    // RETRY QUEUES
    for (let i = 0; i < MAX_RETRIES; i++) {
      const retryQueue = `Order_Retry_Queue_${i + 1}`;
      const ttl = RETRY_DELAYS[i];
      const nextRetryRoutingKey = (i + 1 < MAX_RETRIES)
        ? `Order.retry.${i + 2}`
        : "Order.dlq"; // Last retry sends to DLQ

      await channel.assertQueue(retryQueue, {
        durable: true,
        arguments: {
          "x-message-ttl": ttl,
          "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
          "x-dead-letter-routing-key": nextRetryRoutingKey
        }
      });

      // Bind retry queue to receive retry messages
      await channel.bindQueue(retryQueue, NOTIFICATION_EXCHANGE, `Order.retry.${i + 1}`);
    }

    // DLQ
    await channel.assertQueue("Order_DLQ", { durable: true });
    await channel.bindQueue("Order_DLQ", NOTIFICATION_EXCHANGE, "Order.dlq");

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
          ? `Order.retry.${retryCount + 1}`
          : "Order.dlq";

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

module.exports = { OrderConsumer };
