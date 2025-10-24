const Movie = require("../../models/Client/Movie");
const Screen = require("../../models/Client/Screen");
const Show = require("../../models/Client/Show");
const Theater = require("../../models/Client/Theater");
const redis = require("../../config/redis");
const {cacheOrFetch} = require("../../utils/redisUtility");

const postShowService= async (body)=>{
    const {owner,movieId,theaterId,screenId,showTime,ticketPrice,bookedSeats}= body;
    
    const movie = await Movie.findById(movieId);
    if(!movie) throw new Error("Movie not found !!");
  
    const theater = await Theater.findById(theaterId);
    if(!theater) throw new Error("Theater not found !!");
  
    const screen = await Screen.findById(screenId);
    if(!screen) throw new Error("Screen not found");
  
  
    const booked = [];
    if (Array.isArray(bookedSeats) && bookedSeats.length > 0) {
      if (bookedSeats.length > 0) {
        for (const seatNumber of bookedSeats) {
          const seat = screen.seats.find(
            (s) => `${s.row}${s.number}` === seatNumber
          );
          if (!seat) throw new Error(`Seat ${seatNumber} not found on this screen.`);
          if (!seat.isAvailable) throw new Error(`Seat ${seatNumber} is already booked.`);
          booked.push(`${seat.row}${seat.number}`);
        }
      }
      }
    
  
    const showData={
      owner:owner,
      bookedSeats:booked,
      ticketPrice:ticketPrice && ticketPrice>0 ?ticketPrice:0,
      showTime:showTime,
      screen:screenId,
      theater:theaterId,
      movie:movieId
  
    }
  
    const show = await Show.create(showData);

    redis.del("shows:all");
  
    return show;
    
  }
  
  const getShowsService = async () => {
    return await cacheOrFetch("shows:all", () =>
      Show.find().populate("movie theater screen owner").sort({ showTime: 1 })
    );
  };
  
  const getShowByIdService = async (showId) => {
    return await cacheOrFetch(`show:${showId}`, () =>
      Show.findById(showId).populate("movie theater screen owner")
    );
  };
  
  const updateShowService = async (showId, body) => {
    const { owner, movieId, theaterId, screenId, showTime, ticketPrice, bookedSeats } = body;
  
    const show = await Show.findById(showId);
    if (!show) throw new Error("Show not found !!");
  
    const updateData = {};
  
    if (owner) updateData.owner = owner;

    if (movieId) {
      const movie = await Movie.findById(movieId);
      if (!movie) throw new Error("Movie not found !!");
      updateData.movie = movieId;
    }
  
    if (theaterId) {
      const theater = await Theater.findById(theaterId);
      if (!theater) throw new Error("Theater not found !!");
      updateData.theater = theaterId;
    }
  
    let screen;
    if (screenId) {
      screen = await Screen.findById(screenId);
      if (!screen) throw new Error("Screen not found !!");
      updateData.screen = screenId;
    } else {
      screen = await Screen.findById(show.screen);
    }
  
    if (showTime) updateData.showTime = showTime;
  

    if (ticketPrice !== undefined) updateData.ticketPrice = ticketPrice;
  
    if (Array.isArray(bookedSeats) && bookedSeats.length > 0) {
      const newBooked = [...show.bookedSeats]; 
      for (const seatNumber of bookedSeats) {
        const seat = screen.seats.find(
          (s) => `${s.row}${s.number}` === seatNumber
        );
        if (!seat) throw new Error(`Seat ${seatNumber} not found on this screen.`);
        if (newBooked.includes(seatNumber))
          throw new Error(`Seat ${seatNumber} is already booked for this show.`);
        newBooked.push(seatNumber);
      }
      updateData.bookedSeats = newBooked;
    }
  
    const updatedShow = await Show.findByIdAndUpdate(showId, updateData, { new: true });
    if (!updatedShow) throw new Error("Failed to update show");
  
   
    await redis.del(`show:${showId}`);
    await redis.del("shows:all");
  
    return updatedShow;
  };
  
  const deleteShowService = async (showId) => {
    const deleted = await Show.findByIdAndDelete(showId);
    if (!deleted) throw new Error("Show not found for delete");
  
    await redis.del(`show:${showId}`);
    await redis.del("shows:all");
    return deleted;
  };

  module.exports={
    postShowService,
    getShowsService,
    getShowByIdService,
    updateShowService,
    deleteShowService
}