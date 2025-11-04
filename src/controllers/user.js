const notificationMessageType = require("../constants/notificationMessageType");
const notificationTypes = require("../constants/notificationTypes");
const { publishGeneralMessage } = require("../Notification/Producer/generalProducer");
const { signupService,loginService } = require("../services/authServices");



const signUpHandler= async (req,res)=>{

    try{
        const body = req.body;
       // console.log(body);
        const newUser = await signupService(body);
        //console.log(newUser);

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
              email: newUser._id, // optional if available
              phone: newUser._id, // optional if available
              meta: { newUserId: newUser._id },
            }
        )
   
        res.status(201).json({
            success: true,
            message:"user registered successfully hh !!",
            data: {...newUser.toObject(),password:undefined,salt:undefined},
            error:""
        })
    }catch(e){
        res.status(400).json({
            success:false,
            message:"could not register user ff!!",
            data: {},
            error:e.message
        })
    }
     
}

const loginHandler= async (req,res)=>{

    try{
        const body = req.body;
        const token = await loginService(body);

        await publishGeneralMessage(
            notificationTypes.USER_LOGIN,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "Login Detected",
              message: `Login detected `,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { newUserId: newUser._id },
            }
        )

        res.status(200).json({
            success: true,
            message:"login successfull !!",
            token: token,
            error:""

        })
       
    }catch(e){
        res.status(400).json({
            success: false,
            message:"login unsuccessfull !!",
            token: "",
            error:e.message

        })
    }
     
}

module.exports ={
    signUpHandler,
    loginHandler
}