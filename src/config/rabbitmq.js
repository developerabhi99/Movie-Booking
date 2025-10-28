// src/config/rabbitmq.js
const amqp = require("amqplib");

let connection;
let channel;

async function initRabbitMQ() {
  try {
    const url = process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";
    console.log("🔌 Connecting to RabbitMQ at:", url);

    // Establish connection
    connection = await amqp.connect(url);
    connection.on("error", (err) => console.error("RabbitMQ connection error:", err.message));
    connection.on("close", () => console.warn("RabbitMQ connection closed"));

    // Create channel
    channel = await connection.createChannel();

    console.log("RabbitMQ connected and channel ready");
    return connection;
  } catch (err) {
    console.error("Failed to initialize RabbitMQ:", err.message);
    throw err;
  }
}

async function publish(queueOrExchange, message) {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  // Ensure the queue exists before publishing
  await channel.assertQueue(queueOrExchange, { durable: false });

  // Send message
  channel.sendToQueue(queueOrExchange, Buffer.from(JSON.stringify(message)));
  console.log(`Message published to "${queueOrExchange}":`, message);
}

async function subscribe(queue, handler) {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  // Ensure the queue exists before consuming
  await channel.assertQueue(queue, { durable: false });

  console.log(`Subscribed to queue: ${queue}`);

  await channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log("Received message:", data);
        await handler(data);
        channel.ack(msg);
      } catch (err) {
        console.error("Message handling error:", err);
        channel.nack(msg);
      }
    }
  });
}

module.exports = { initRabbitMQ, publish, subscribe };
