const {
    postMovieService,
    getMoviesService,
    getMovieByIdService,
    updateMovieService,
    deleteMovieService,
  } = require("../../services/Client/movie");
  
  const postMovieHandler = async (req, res) => {
    try {
      const movie = await postMovieService({ ...req.body, addedBy: req.user._id });
      res.status(201).json({
        success: true,
        message: "Movie registered successfully !!",
        data: movie,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Movie registration unsuccessful !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getMoviesHandler = async (req, res) => {
    try {
      const movies = await getMoviesService();
      res.status(200).json({
        success: true,
        message: "Movies fetched successfully !!",
        data: movies,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch movies !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getMovieByIdHandler = async (req, res) => {
    try {
      const movie = await getMovieByIdService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Movie fetched successfully !!",
        data: movie,
        error: "",
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: "Movie not found !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const updateMovieHandler = async (req, res) => {
    try {
      const updated = await updateMovieService(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Movie updated successfully !!",
        data: updated,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to update movie !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const deleteMovieHandler = async (req, res) => {
    try {
      const deleted = await deleteMovieService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Movie deleted successfully !!",
        data: deleted,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to delete movie !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  module.exports = {
    postMovieHandler,
    getMoviesHandler,
    getMovieByIdHandler,
    updateMovieHandler,
    deleteMovieHandler,
  };
  