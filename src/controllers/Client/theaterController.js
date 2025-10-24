const {
    postTheaterService,
    getTheatersService,
    getTheaterByIdService,
    updateTheaterService,
    deleteTheaterService,
  } = require("../../services/Client/theater");
  
  const postTheaterHandler = async (req, res) => {
    try {
      const body = { ...req.body, owner: req.user._id };
      const theater = await postTheaterService(body);
  
      res.status(201).json({
        success: true,
        message: "Theater registered successfully !!",
        data: theater,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Theater registration unsuccessful !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getTheatersHandler = async (req, res) => {
    try {
      const theaters = await getTheatersService();
      res.status(200).json({
        success: true,
        message: "Theaters fetched successfully !!",
        data: theaters,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch theaters !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getTheaterByIdHandler = async (req, res) => {
    try {
      const theater = await getTheaterByIdService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Theater fetched successfully !!",
        data: theater,
        error: "",
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: "Theater not found !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const updateTheaterHandler = async (req, res) => {
    try {
      const updated = await updateTheaterService(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Theater updated successfully !!",
        data: updated,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to update theater !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const deleteTheaterHandler = async (req, res) => {
    try {
      const deleted = await deleteTheaterService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Theater deleted successfully !!",
        data: deleted,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to delete theater !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  module.exports = {
    postTheaterHandler,
    getTheatersHandler,
    getTheaterByIdHandler,
    updateTheaterHandler,
    deleteTheaterHandler,
  };
  