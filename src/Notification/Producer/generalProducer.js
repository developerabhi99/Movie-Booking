const { initRabbitMQ, NOTIFICATION_EXCHANGE } = require("../../config/rabbitmq");

const QUEUE_NAME = "General_Queue";
const RETRY_QUEUE = "General_Retry_Queue";
const DLQ_QUEUE = "General_DLQ";

async function setupGeneralQueues(channel) {
 
  await channel.assertQueue(DLQ_QUEUE, { durable: true });


  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-message-ttl": 10000, 
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "General.main",
    },
  });

  
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": NOTIFICATION_EXCHANGE,
      "x-dead-letter-routing-key": "General.retry",
    },
  });

 
  await channel.bindQueue(QUEUE_NAME, NOTIFICATION_EXCHANGE, "General.main");
  await channel.bindQueue(RETRY_QUEUE, NOTIFICATION_EXCHANGE, "General.retry");
  await channel.bindQueue(DLQ_QUEUE, NOTIFICATION_EXCHANGE, "General.dlq");

  console.log("General Queues configured");
}

async function publishGeneralMessage(type,messageType=[],message) {
  try {
    const { channel } = await initRabbitMQ();
    await setupGeneralQueues(channel);

    //const msg = Buffer.from(JSON.stringify(message));

    const payload ={
      type,
      messageType,
      message
    }
    const msg = Buffer.from(JSON.stringify(payload));


    await channel.publish(NOTIFICATION_EXCHANGE, "General.main", msg, { persistent: true });
    console.log("Message published to General_Queue");
  } catch (err) {
    console.error("Failed to publish message:", err.message);
  }
}

module.exports = { publishGeneralMessage };
