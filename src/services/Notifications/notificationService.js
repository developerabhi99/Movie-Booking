const transporter = require("../../config/email");
const notificationMessageType = require("../../constants/notificationMessageType");
const Notification = require("../../models/Notification/Notification");
const { sendSMS, sendWhatsApp } = require("../../utils/sms");

/**
 * Handles notification logic:
 * - Saves in-app notification to DB
 * - Optionally sends email, SMS, or WhatsApp
 * 
 * @param {string} type - Notification event type
 * @param {Array<string>} messageType - Types of notifications to send
 * @param {Object} payload - Notification data
 */
async function handleNotification(type, messageType = [], payload = {}) {
  try {
    const { userId, title, message, email, phone, meta = {} } = payload;

    if (!userId || !title || !message) {
      console.warn("⚠️ Missing required notification fields:", { userId, title, message });
      return;
    }

    // Ensure messageType is always an array
    if (!Array.isArray(messageType)) {
      messageType = [messageType];
    }

    let savedNotification = null;

    // 1️⃣ Save in-app notification
    if (messageType.includes(notificationMessageType.InAppNotification)) {
      savedNotification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        meta,
      });
      console.log(`💾 Notification stored → User: ${userId}, Type: ${type}`);
    }

    // 2️⃣ Send Email
    if (messageType.includes(notificationMessageType.MailNotification) && email) {
      try {
        await transporter.sendMail({
          from: `"MovieBooking" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: title,
          text: message,
        });
        console.log(`📧 Email sent → ${email}`);
      } catch (err) {
        console.error("❌ Email sending failed:", err.message);
      }
    }

    // 3️⃣ Send SMS
    if (messageType.includes(notificationMessageType.PhoneNotification) && phone) {
      try {
        await sendSMS(phone, message);
        console.log(`📱 SMS sent → ${phone}`);
      } catch (err) {
        console.error("❌ SMS sending failed:", err.message);
      }
    }

    // 4️⃣ Send WhatsApp
    if (messageType.includes(notificationMessageType.WhatsAppNotification) && phone) {
      try {
        await sendWhatsApp(phone, message);
        console.log(`💬 WhatsApp sent → ${phone}`);
      } catch (err) {
        console.error("❌ WhatsApp sending failed:", err.message);
      }
    }

    return savedNotification;
  } catch (err) {
    console.error("❌ Notification handling error:", err.message);
  }
}

module.exports = { handleNotification };
