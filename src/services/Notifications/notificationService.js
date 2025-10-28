const transporter = require("../../config/email");
const Notification = require("../../models/Notification/Notification");
const { sendSMS,sendWhatsApp } = require("../../utils/sms");

/**
 * Handles notification logic:
 * - Saves in-app notification to DB
 * - Optionally sends email and SMS
 * @param {string} type - Notification event type
 * @param {Object} payload - Notification data
 */
async function handleNotification(type, payload = {}) {
  const { userId, title, message, email, phone, meta = {} } = payload;

  if (!userId || !title || !message) {
    console.warn("Missing required notification fields:", { userId, title, message });
    return;
  }

  try {
    // 1️⃣ Save in-app notification
    const savedNotification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      meta,
    });

    console.log(`Notification stored → User: ${userId}, Type: ${type}`);

    // 2️⃣ Send Email (if email is provided)
    if (email) {
      try {
        await transporter.sendMail({
          from: `"MovieBooking" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: title,
          text: message,
        });
        console.log(`Email sent → ${email}`);
      } catch (err) {
        console.error("Email sending failed:", err.message);
      }
    }

    // 3️⃣ Send SMS (if phone is provided)
    if (phone) {
      try {
        await sendSMS(phone, message);
        await sendWhatsApp(phone, message);
        console.log(`SMS sent → ${phone}`);
      } catch (err) {
        console.error("SMS sending failed:", err.message);
      }
    }

    return savedNotification;
  } catch (err) {
    console.error("Notification handling error:", err.message);
    // Optionally forward this to Sentry / logging service
  }
}

module.exports = { handleNotification };
