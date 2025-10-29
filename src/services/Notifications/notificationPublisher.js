// services/notifications/notificationPublisher.js
const { publish } = require("../../config/rabbitmq");

const NOTIFICATION_QUEUE = "notification.queue";

async function publishNotificationEvent(type,messageType = [], payload) {
  try { 
    const message = {
      type,
      messageType,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Publish directly to the queue using our helper
    await publish(NOTIFICATION_QUEUE, message);

    console.log(`📤 Notification published → ${type}`);
  } catch (error) {
    console.error("❌ Failed to publish notification:", error.message);
  }
}

module.exports = { publishNotificationEvent };
