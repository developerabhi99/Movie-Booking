const transporter = require("../../config/email");
const notificationMessageType = require("../../constants/notificationMessageType");
const Notification = require("../../models/Notification/Notification");
const { sendSMS,sendWhatsApp } = require("../../utils/sms");

/**
 * Handles notification logic:
 * - Saves in-app notification to DB
 * - Optionally sends email and SMS
 * @param {string} type - Notification event type
 * @param {Object} payload - Notification data
 */
async function handleNotification(type,messageType=[], payload = {}) {
  const { userId, title, message, email, phone, meta = {} } = payload;

  if (!userId || !title || !message) {
    console.warn("Missing required notification fields:", { userId, title, message });
    return;
  }

  try {

    if(messageType.includes(notificationMessageType.InAppNotification)){
         // 1️. Save in-app notification
    const savedNotification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      meta,
    });
    savedNotification()
    console.log(`Notification stored → User: ${userId}, Type: ${type}`);
    }
  
    if(messageType.includes(notificationMessageType.MailNotification)){
           // 2️. Send Email (if email is provided)
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
    }
   
    if(messageType.includes(notificationMessageType.PhoneNotification)){
        // 3️. Send SMS (if phone is provided)
    if (phone) {
      try {
        await sendSMS(phone, message);
        console.log(`SMS sent → ${phone}`);
      } catch (err) {
        console.error("SMS sending failed:", err.message);
      }
    }
    }

    if(messageType.includes(notificationMessageType.WhatsAppNotification)){
      try {
        await sendWhatsApp(phone, message);
        console.log(`WhatsApp sent → ${phone}`);
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
