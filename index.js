require('dotenv').config();
const express = require('express');
const connectDB = require("./src/config/db");
const userRoute = require("./src/routes/user");
const theaterRoute = require("./src/routes/Client/theater");
const { checkAuthenticatedUser, checkRoleAuthorizationForClient } = require('./src/middlewares/authentication');

const app = express();
const setupSwagger = require("./src/config/swagger");

setupSwagger(app); // this will create /api-docs route

app.use(express.urlencoded({extended:true})); 
app.use(express.json());
connectDB();

app.get('/',checkAuthenticatedUser,(req,res)=>{
    res.send("Server is running");
});

app.use("/user",userRoute);

app.use("/theater",
checkAuthenticatedUser,
checkRoleAuthorizationForClient('CLIENT'),    
theaterRoute);


const PORT = process.env.PORT;
app.listen(PORT,()=> console.log(`Express Server running at port : ${PORT}`));
