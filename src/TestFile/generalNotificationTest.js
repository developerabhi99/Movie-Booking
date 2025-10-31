const { publishGeneralMessage } = require("../Notification/Producer/generalProducer");


(async () => {
  const message = {
    id: Date.now(),
    type: "notification",
    text: "Hello from producer!",
  };

  await publishGeneralMessage(message);
  console.log("✅ Message sent!");
})();
