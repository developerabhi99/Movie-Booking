const notificationMessageType = require("../constants/notificationMessageType");
const notificationTypes = require("../constants/notificationTypes");
const { publishGeneralMessage } = require("../Notification/Producer/generalProducer");


(async () => {
  const message = {
    id: Date.now(),
    type: "notification",
    text: "Hello from producer!",
  };

  await publishGeneralMessage(
      notificationTypes.MOVIE_ADDED,
      [
        notificationMessageType.InAppNotification,
        notificationMessageType.MailNotification,
        notificationMessageType.PhoneNotification,
        notificationMessageType.WhatsAppNotification,
      ],
      {
        userId: 1,
        title: "New Movie Added",
        message: `Movie  has been successfully added.`,
        email: "yesabhi@gmail.com", // optional if available
        phone: "+91 7003207968", // optional if available
        meta: {  },
      }
  );
  console.log("✅ Message sent!");
})();
