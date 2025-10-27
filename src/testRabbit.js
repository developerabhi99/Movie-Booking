const { initRabbitMQ, publish, subscribe } = require("./config/rabbitmq");

(async () => {
  await initRabbitMQ();

  // Subscribe to queue
  await subscribe("notifications", (data) => {
    console.log("🎯 Notification received:", data);
  });

  // Publish a test message
  await publish("notifications", { message: "Hello RabbitMQ!" });
})();
