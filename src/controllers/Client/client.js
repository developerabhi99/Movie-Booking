const { postTheaterService,postScreenLayoutTemplateService,postScreenService } = require("../../services/Client/client");


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

const postScreenLayoutTemplateHandler=async (req,res)=>{
    try{
        const body = req.body;
        const screenLayoutTemplate = await postScreenLayoutTemplateService(body);
        //console.log(screenLayoutTemplate);

        res.status(201).json({
            success: true,
            message:"Screen Layout Template registered successfully !!",
            data: screenLayoutTemplate,
            error:""
        });

    }catch(e){
        res.status(400).json({
            success: false,
            message:"Screen Layout Template registered successfully !!",
            data: "",
            error:e.message
        });
    }
}
const postScreenHandler=async (req,res)=>{
    try{
        const body = req.body; 
        const screen = await postScreenService(body);

        res.status(201).json({
            success: true,
            message:"Screen registered successfully !!",
            data: screen,
            error:""
        });

    }catch(e){
        res.status(400).json({
            success: false,
            message:"Screen registeration unsuccessfull !!",
            data: "",
            error:e.message
        });
    }
}
const postMovieHandler=async (req,res)=>{
    try{
        const body=req.body;
        const movie = await postMovieHandler({...data,addedBy:req.user._id});

    }catch(e){

    }
}

module.exports={
    postTheaterHandler,
    postScreenLayoutTemplateHandler,
    postScreenHandler,
    postMovieHandler
}