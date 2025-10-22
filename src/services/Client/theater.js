const Theater = require("../../models/Client/Theater");

const postTheaterService = async (body)=>{
    
    const {owner,name,location,totalSeats,screens}=body;

    const theater = await Theater.create({
        name,
        location,
        totalSeats,
        screens,
        owner
    });
    
    return theater;

}

module.exports={
    postTheaterService
}