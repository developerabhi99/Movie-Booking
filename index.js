require('dotenv').config();
const express = require('express');
const connectDB = require("./src/config/db");
const connectRedis = require("./src/config/redis");
const userRoute = require("./src/routes/user");
const clientRoute = require("./src/routes/Client/client");
const paymentRoute = require("./src/routes/User/booking"); 

const { initRabbitMQ } = require("./src/config/rabbitmq");
// const { startNotificationConsumer } = require("./src/services/Notifications/notificationConsumer");

const { checkAuthenticatedUser, checkRoleAuthorizationForClient } = require('./src/middlewares/authentication');

const app = express();
const setupSwagger = require("./src/config/swagger");

setupSwagger(app); 

app.use(express.urlencoded({extended:true})); 
app.use(express.json());
connectDB();
connectRedis;
(async () => {
    try {
      console.log("🚀 Initializing RabbitMQ...");
      await initRabbitMQ();
  
      // console.log("🎧 Starting Notification Consumer...");
      // await startNotificationConsumer();
  
      // console.log("✅ RabbitMQ & Notification Consumer ready");
    } catch (err) {
      console.error("❌ Failed to initialize RabbitMQ or start consumer:", err.message);
    }
  })();

app.use("/user",userRoute);

app.use("/client",
checkAuthenticatedUser,
checkRoleAuthorizationForClient('CLIENT'),    
clientRoute);

app.use("/booking",
    checkAuthenticatedUser,
    checkRoleAuthorizationForClient('CLIENT','USER','ADMIN'),    
    paymentRoute);
app.use((err, req, res, next) => {
        res.status(400).json({ success: false, message: err.message });
      });
      

const PORT = process.env.PORT;
app.listen(PORT,()=> console.log(`Server running at port : ${PORT}`));
 