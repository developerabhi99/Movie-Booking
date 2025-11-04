const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");

const QUEUE_NAME = "Payment_Queue";
const RETRY_QUEUE = "Payment_Retry_Queue";
const DLQ_QUEUE = "Payment_DLQ";

async function setupPaymentQueues(channel) {
 
  await channel.assertQueue(DLQ_QUEUE, { durable: true });


  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-message-ttl": 10000, 
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "Payment.main",
    },
  });

  
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "Payment.retry",
    },
  });

 
  await channel.bindQueue(QUEUE_NAME, NOTIFICATION_EXCHANGE, "Payment.main");
  await channel.bindQueue(RETRY_QUEUE, NOTIFICATION_EXCHANGE, "Payment.retry");
  await channel.bindQueue(DLQ_QUEUE, NOTIFICATION_EXCHANGE, "Payment.dlq");

  console.log("Payment Queues configured");
}

async function publishPaymentMessage(type,messageType=[],message) {
  try {
    const { channel } = await initRabbitMQ();
    await setupPaymentQueues(channel);

    const payload ={
      type,
      messageType,
      message
    }
    const msg = Buffer.from(JSON.stringify(payload));

    await channel.publish(NOTIFICATION_EXCHANGE, "Payment.main", msg, { persistent: true });
    console.log("Message published to Payment_Queue");
  } catch (err) {
    console.error("Failed to publish message:", err.message);
  }
}

module.exports = { publishPaymentMessage };
