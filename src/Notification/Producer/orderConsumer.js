const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");

const QUEUE_NAME = "Order_Queue";
const RETRY_QUEUE = "Order_Retry_Queue";
const DLQ_QUEUE = "Order_DLQ";

async function setupOrderQueues(channel) {
 
  await channel.assertQueue(DLQ_QUEUE, { durable: true });


  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-message-ttl": 10000, 
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "Order.main",
    },
  });

  
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "Order.retry",
    },
  });

 
  await channel.bindQueue(QUEUE_NAME, NOTIFICATION_EXCHANGE, "Order.main");
  await channel.bindQueue(RETRY_QUEUE, NOTIFICATION_EXCHANGE, "Order.retry");
  await channel.bindQueue(DLQ_QUEUE, NOTIFICATION_EXCHANGE, "Order.dlq");

  console.log("Order Queues configured");
}

async function publishOrderMessage(type,messageType=[],message) {
  try {
    const { channel } = await initRabbitMQ();
    await setupOrderQueues(channel);

    const payload ={
      type,
      messageType,
      message
    }
    const msg = Buffer.from(JSON.stringify(payload));

    await channel.publish(NOTIFICATION_EXCHANGE, "Order.main", msg, { persistent: true });
    console.log("Message published to Order_Queue");
  } catch (err) {
    console.error("Failed to publish message:", err.message);
  }
}

module.exports = { publishOrderMessage };
