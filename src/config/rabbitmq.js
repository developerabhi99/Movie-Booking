const amqp = require("amqplib");

let connection;
let channel;

const NOTIFICATION_EXCHANGE = "Notification_Exchange";

async function initRabbitMQ() {
  try {
    if (connection && channel) {
      return { connection, channel };
    }

    const url = process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672/";
    console.log("Connecting to RabbitMQ at:", url);

    const maxAttempts = 8;
    
    let lastErr = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        connection = await amqp.connect(url, { heartbeat: 10, timeout: 10000 });
        break;
      } catch (err) {
        lastErr = err;
        const delayMs = Math.min(200 * Math.pow(2, attempt - 1), 5000);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    if (!connection) {
      throw lastErr || new Error("Unable to connect to RabbitMQ");
    }

    connection.on("error", (err) => console.error("RabbitMQ connection error:", err.message));
    connection.on("close", () => {
      console.warn("RabbitMQ connection closed");
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();

    await channel.assertExchange(NOTIFICATION_EXCHANGE, "topic", { durable: true });
    console.log(`Exchange "${NOTIFICATION_EXCHANGE}" is ready`);

    return { connection, channel };
  } catch (err) {
    console.error("Failed to initialize RabbitMQ:", err.message);
    throw err;
  }
}

module.exports = {
  initRabbitMQ,
  NOTIFICATION_EXCHANGE,
};
