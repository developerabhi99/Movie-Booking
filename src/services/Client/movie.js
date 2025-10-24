const redis = require("../../config/redis");
const Movie = require("../../models/Client/Movie");
const {cacheOrFetch} = require("../../utils/redisUtility");

const postMovieService = async (body) => {
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

  //console.log(movieData);

  const movie = await Movie.create(movieData); 
  await redis.del("movies:all");
  return movie;
};

const getMoviesService = async () => {
  return await cacheOrFetch("movies:all", () =>
    Movie.find().sort({ createdAt: -1 })
  );
};

const getMovieByIdService = async (movieId) => {
  return await cacheOrFetch(`movie:${movieId}`, () =>
    Movie.findById(movieId)
  );
};

const updateMovieService = async (movieId, body) => {
  const updateData = {};

  if (body.title) updateData.title = body.title;
  if (body.description) updateData.description = body.description;
  if (body.genre) updateData.genre = body.genre;
  if (body.duration) updateData.duration = body.duration;
  if (body.language) updateData.language = body.language;
  if (body.releaseDate) updateData.releaseDate = body.releaseDate;
  if (body.rating) updateData.rating = body.rating;
  if (body.posterUrl) updateData.posterUrl = body.posterUrl;
  if (body.trailerUrl) updateData.trailerUrl = body.trailerUrl;
  if (body.cast) updateData.cast = body.cast;
  if (body.director) updateData.director = body.director;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.addedBy) updateData.addedBy = body.addedBy;

  const updated = await Movie.findByIdAndUpdate(movieId, updateData, { new: true });
  if (!updated) throw new Error("Movie not found or failed to update");

  await redis.del(`movie:${movieId}`);
  await redis.del("movies:all");

  return updated;
};

const deleteMovieService = async (movieId) => {
  const deleted = await Movie.findByIdAndDelete(movieId);
  if (!deleted) throw new Error("Movie not found for delete");

  await redis.del(`movie:${movieId}`);
  await redis.del("movies:all");
  return deleted;
};

module.exports={
    postMovieService,
    getMoviesService,
    getMovieByIdService,
    updateMovieService,
    deleteMovieService
}