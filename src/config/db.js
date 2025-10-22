const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected");
    }catch(e){
        console.log("Cannot connect Mongo DB because ",e.message);
        process.exit(1);
    }
}

module.exports = connectDB;