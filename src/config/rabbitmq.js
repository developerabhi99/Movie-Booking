const amqp = require("amqplib");

let connection;
let channel;

const NOTIFICATION_EXCHANGE = "Notification_Exchange";

async function initRabbitMQ() {
  try {
    if (connection && channel) {
      return { connection, channel };
    }

    const url = process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";
    console.log("Connecting to RabbitMQ at:", url);

    connection = await amqp.connect(url);

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
