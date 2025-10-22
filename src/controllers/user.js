const { signupService,loginService } = require("../services/authServices");



const signUpHandler= async (req,res)=>{

    try{
        const body = req.body;
        const newUser = await signupService(body);
   
        res.status(201).json({
            success: true,
            message:"user registered successfully !!",
            data: {...newUser.toObject(),password:undefined,salt:undefined},
            error:""
        })
    }catch(e){
        res.status(400).json({
            success:false,
            message:"could not register user !!",
            data: {},
            error:e.message
        })
    }
     
}

const loginHandler= async (req,res)=>{

    try{
        const body = req.body;
        const token = await loginService(body);

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