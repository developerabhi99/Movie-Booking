const { postTheaterService } = require("../../services/Client/theater");


const postTheaterHandler=async (req,res)=>{
   try{
     const body={...req.body,owner:req.user._id};
     const theater = await postTheaterService(body);

     res.status(201).json({
        success: true,
        message:"theater registered successfully !!",
        data: theater,
        error:""
    });
   }catch(e){
        res.status(400).json({
            success: false,
            message:"theater registeration unsuccessfull !!",
            data: "",
            error:e.message
        });
   }
}

module.exports={
    postTheaterHandler
}