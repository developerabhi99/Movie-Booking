const notificationTypes = require("../../constants/notificationTypes");
const { publishGeneralMessage } = require("../../Notification/Producer/generalProducer");

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
      await publishGeneralMessage(
        notificationTypes.THEATER_ADDED,
        [
          notificationMessageType.InAppNotification,
          notificationMessageType.MailNotification,
        ],
        {
          userId: req.user._id,
          title: "New Theater Added",
          message: `Theater "${theater.name}" has been successfully added.`,
          email: req.user._id, // optional if available
          phone: req.user._id, // optional if available
          meta: { theaterId: theater._id },
        }
      );
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
      await publishGeneralMessage(
        notificationTypes.THEATER_UPDATED,
        [
          notificationMessageType.InAppNotification,
          notificationMessageType.MailNotification,
        ],
        {
          userId: req.user._id,
          title: "New Theater Updated",
          message: `Theater "${updated.name}" has been successfully updated.`,
          email: req.user._id, // optional if available
          phone: req.user._id, // optional if available
          meta: { updatedId: updated._id },
        }
      );
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
      await publishGeneralMessage(
        notificationTypes.THEATER_DELETED,
        [
          notificationMessageType.InAppNotification,
          notificationMessageType.MailNotification,
        ],
        {
          userId: req.user._id,
          title: "Theater Deleted",
          message: `Theater "${deleted.name}" has been successfully deleted.`,
          email: req.user._id, // optional if available
          phone: req.user._id, // optional if available
          meta: { deletedId: deleted._id },
        }
      );
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
  