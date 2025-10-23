const Movie = require("../../models/Client/Movie");
const Screen = require("../../models/Client/Screen");
const ScreenLayoutTemplate = require("../../models/Client/ScreenLayoutTemplate");
const Theater = require("../../models/Client/Theater");

const postTheaterService = async (body) => {
  const { owner, name, location, city, state, pincode } = body;

  const theaterData = {
    name,
    location,
    city,
    owner,
  };

  if (state) theaterData.state = state;
  if (pincode) theaterData.pincode = pincode;

  const theater = await Theater.create(theaterData);

  return theater;
};

const postScreenLayoutTemplateService = async (body) => {
  const { name, seats, seatTypes } = body;

  if (!name) throw new Error("Template name is required !!");

  const seatLength = seats ? seats.length : 0;

  const templateData = {
    name,
    seats: seats || [],
    seatTypes: seatTypes || [],
    seatLength,
  };

  const template = await ScreenLayoutTemplate.create(templateData);

  return template;
};

const postScreenService = async (body) => {
  const { theaterId, name, layoutTemplateId, seatTypes } = body;

  const theater = await Theater.findById(theaterId);

  if (!theater) throw new Error("Theater not found !!");

  let templateSeats = [];
  let templateSeatsType = [];

  if (layoutTemplateId) {
    const screenLayoutTemplate = await ScreenLayoutTemplate.findById(
      layoutTemplateId
    );

    if (!screenLayoutTemplate) throw new Error("Screen Layout not found !!");

    templateSeats = screenLayoutTemplate.seats.map((seat) => ({
      row: seat.row,
      number: seat.number,
      type: seat.type,
      isAvailable: true,
    }));

    templateSeatsType = screenLayoutTemplate.seatTypes.map((seatType) => ({
      type: seatType.type,
      price: seatType.price,
    }));
  }

  const finalSeatTypes =
    seatTypes && seatTypes.length > 0 ? seatTypes : templateSeatTypes;
  const totalSeats = templateSeats.length;

  const screen = await Screen.create({
    theater: theaterId,
    name: name,
    layoutTemplate: layoutTemplateId,
    totalSeats: totalSeats,
    seatTypes: finalSeatTypes,
    seats: templateSeats,
  });

  return screen;
};

const postMovieHandler = async (body) => {
  /**
     *   title: { type: String, required: true },
         description: { type: String },
         genre: [String],
         duration: { type: Number, required: true }, // in minutes
         language: { type: String, required: true },
         releaseDate: { type: Date, required: true },
         rating: { type: Number, min: 0, max: 10 },
         posterUrl: String,
         trailerUrl: String,
         cast: [String],
         director: String,
         addedBy: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User", // theater owner who adds the movie
         },
         isActive: { type: Boolean, default: true },
     */

  const {
    title,
    description,
    genre,
    duration,
    language,
    releaseDate,
    rating,
    posterUrl,
    trailerUrl,
    cast,
    director,
    isActive,
    addedBy,
  } = body;

  const movieData = {
    title,
    description,
    genre,
    duration,
    language,
    releaseDate,
    rating,
    posterUrl,
    trailerUrl,
    cast,
    director,
    isActive,
    addedBy,
  };

  const movie = await Movie(movieData);

  return movie;
};

module.exports = {
  postTheaterService,
  postScreenLayoutTemplateService,
  postScreenService,
  postMovieHandler,
};
