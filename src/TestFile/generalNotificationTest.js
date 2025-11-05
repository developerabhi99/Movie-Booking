const notificationMessageType = require("../constants/notificationMessageType");
const notificationTypes = require("../constants/notificationTypes");
const { publishGeneralMessage } = require("../Notification/Producer/generalProducer");


(async () => {
  const message = {
    id: Date.now(),
    type: "notification",
    text: "Hello from producer!",
  };

  const newUser={
    "firstName": "Client",
    "lastName": "Shaw",
    "email": "yesabhi20161@gmail.com",
    "profileImageUrl": "/images/default.png",
    "contactNumber": 7003207968,
    "role": [
        "USER",
        "CLIENT"
    ],
    "_id": "690a3d08452a12960c1c7371",
    "createdAt": "2025-11-04T17:51:04.236Z",
    "updatedAt": "2025-11-04T17:51:04.236Z",
    "__v": 0
};
  await publishGeneralMessage(
              notificationTypes.USER_SIGNUP,
              [
                notificationMessageType.InAppNotification,
                notificationMessageType.MailNotification,
                notificationMessageType.PhoneNotification,
                notificationMessageType.WhatsAppNotification
              ],
              {
                userId: newUser._id,
                title: "Welcome to MBA",
                message: `Signup "${newUser}" has been successfull.`,
                email: newUser.email, // optional if available
                phone: newUser.contactNumber, // optional if available
                meta: { newUserId: newUser._id },
              }
          )
  console.log("✅ Message sent!");
})();
