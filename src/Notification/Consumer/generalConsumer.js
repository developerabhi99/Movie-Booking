const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");

const QUEUE_NAME = "General_Queue";
const MAX_RETRIES = 6;

// Define exponential retry delays (in milliseconds)
const RETRY_DELAYS = [5000, 10000, 20000, 40000, 80000, 160000]; // 5s → 160s

async function generalConsumer() {
  try {
    const { channel } = await initRabbitMQ();
    console.log("Listening to:", QUEUE_NAME);

    // Dynamically create retry queues if not already declared
    for (let i = 0; i < MAX_RETRIES; i++) {
      const queueName = `General_Retry_Queue_${i + 1}`;
      const ttl = RETRY_DELAYS[i];

      await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          "x-message-ttl": ttl,
          "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
          "x-dead-letter-routing-key": "General.main", // Send back to main queue after TTL
        },
      });

      await channel.bindQueue(queueName, NOTIFICATION_EXCHANGE, `General.retry.${i + 1}`);
      console.log(`Configured ${queueName} with TTL ${ttl / 1000}s`);
    }

    // Consume messages from main queue
    await channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      const headers = msg.properties.headers || {};
      const retryCount = headers["x-retry-count"] || 0;

      try {
        console.log("Received message:", data);

        // Simulate error for testing (remove in production)
        throw new Error("Simulated failure");

        // If success
        console.log(" Processed successfully");
        channel.ack(msg);

      } catch (error) {
        console.error(` Failed (attempt ${retryCount + 1}):`, error.message);

        if (retryCount < MAX_RETRIES) {
          const nextRetryQueue = `General_Retry_Queue_${retryCount + 1}`;
          const nextRoutingKey = `General.retry.${retryCount + 1}`;

          channel.publish(
            NOTIFICATION_EXCHANGE,
            nextRoutingKey,
            Buffer.from(JSON.stringify(data)),
            {
              persistent: true,
              headers: { "x-retry-count": retryCount + 1 },
            }
          );

          console.log(
            `Message sent to ${nextRetryQueue} (will retry in ${
              RETRY_DELAYS[retryCount] / 1000
            }s)`
          );
        } else {
          // Move to DLQ after max retries
          channel.publish(
            NOTIFICATION_EXCHANGE,
            "General.dlq",
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
          );
          console.log(" Message sent to DLQ after max retries");
        }

        // Always ack the original message
        channel.ack(msg);
      }
    });

  } catch (err) {
    console.error("Consumer initialization error:", err.message);
  }
}

module.exports = { generalConsumer };
