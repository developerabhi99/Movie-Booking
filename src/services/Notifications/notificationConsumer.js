// services/notifications/notificationConsumer.js
const { subscribe } = require("../../config/rabbitmq");
const { handleNotification } = require("./notificationService");

const NOTIFICATION_QUEUE = "notification.queue";

async function startNotificationConsumer() {
  try {
    console.log("Waiting for notifications on:", NOTIFICATION_QUEUE);

    await subscribe(NOTIFICATION_QUEUE, async (message) => {
      try {
        let content;

        // Safely parse message — handle Buffer, string, or object
        if (Buffer.isBuffer(message)) {
          content = JSON.parse(message.toString());
        } else if (typeof message === "string") {
          content = JSON.parse(message);
        } else if (typeof message === "object" && message !== null) {
          content = message; // already parsed
        } else {
          throw new Error("Unsupported message format");
        }

        console.log(` Notification event received: ${content.type}`);

        await handleNotification(content.type, content.payload);
      } catch (err) {
        console.error("Error processing notification message:", err.message);
      }
    });

    console.log("Notification consumer started successfully");
  } catch (err) {
    console.error("Notification consumer failed to start:", err.message);
  }
}

module.exports = { startNotificationConsumer };
