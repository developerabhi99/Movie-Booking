// utils/sms.js
const twilio = require("twilio");

const accountSid =
  process.env.TWILIO_ACCOUNT_SID || "AC532e47155518ccdb147d203b552c50c7";
const authToken =
  process.env.TWILIO_AUTH_TOKEN || "9fbbdef3b96f22d7a4943fa5975dd4fd";
const messagingServiceSid =
  process.env.TWILIO_MESSAGING_SERVICE_SID || "MG13fea770ebc0ca5e1f31cddfe3861924";
const whatsappFrom =
  process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
const contentSid =
  process.env.TWILIO_WHATSAPP_CONTENT_SID || "HX350d429d32e64a552466cafecbe95f3c";

const client = twilio(accountSid, authToken);

/**
 * Send SMS using Twilio Messaging Service
 */
async function sendSMS(phone, message) {
  try {
    const response = await client.messages.create({
      body: message,
      messagingServiceSid,
      to: phone,
    });

    console.log(`📱 SMS sent successfully to ${phone} → SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("❌ SMS sending failed:", error.message);
    throw error;
  }
}

/**
 * Send WhatsApp message using Twilio Content Template or fallback to simple text
 */
async function sendWhatsApp(phone, messageOrVars) {
  try {
    const twilioClient = twilio(accountSid, authToken);

    const payload = {
      from: whatsappFrom,
      to: `whatsapp:${phone}`,
    };

    if (typeof messageOrVars === "string") {
      // Plain text message (no template)
      payload.body = messageOrVars;
    } else if (
      typeof messageOrVars === "object" &&
      Object.keys(messageOrVars).length > 0
    ) {
      // Template message with variables
      payload.contentSid = contentSid;
      payload.contentVariables = JSON.stringify(messageOrVars);
    } else {
      // Template with no variables
      payload.contentSid = contentSid;
    }

    const response = await twilioClient.messages.create(payload);

    console.log(`💬 WhatsApp message sent to ${phone} → SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("❌ WhatsApp message failed:", error.message);
    throw error;
  }
}

module.exports = { sendSMS, sendWhatsApp };
