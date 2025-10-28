// utils/sms.js
const twilio = require("twilio");

const accountSid =
  process.env.TWILIO_ACCOUNT_SID ;
const authToken =
  process.env.TWILIO_AUTH_TOKEN ;
const messagingServiceSid =
  process.env.TWILIO_MESSAGING_SERVICE_SID ;
const whatsappFrom =
  process.env.TWILIO_WHATSAPP_FROM ;
const contentSid =
  process.env.TWILIO_WHATSAPP_CONTENT_SID ;

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
        // Plain text message
        payload.body = messageOrVars;
  
      } else if (typeof messageOrVars === "object" && Object.keys(messageOrVars).length > 0) {
        // Convert variables into Twilio format: {"1":"value1","2":"value2"}
        const formattedVars = {};
        let i = 1;
  
        for (const value of Object.values(messageOrVars)) {
          formattedVars[i.toString()] = String(value ?? "");
          i++;
        }
  
        payload.contentSid = contentSid;
        payload.contentVariables = JSON.stringify(formattedVars);
  
      } else {
        // No variables — use default template
        payload.contentSid = contentSid;
        payload.contentVariables = JSON.stringify({ "1": "", "2": "" });
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
