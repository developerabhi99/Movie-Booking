const notificationTypes = require("../../constants/notificationTypes");
const { publishGeneralMessage } = require("../../Notification/Producer/generalProducer");

const {
    postShowService,
    getShowsService,
    getShowByIdService,
    updateShowService,
    deleteShowService,
  } = require("../../services/Client/show");
  
  const postShowHandler = async (req, res) => {
    try {
      const show = await postShowService({ ...req.body, owner: req.user._id });
       await publishGeneralMessage(
            notificationTypes.SHOW_ADDED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "New Show Added",
              message: `Show "${show.showTime}" for ${show.movie} has been successfully added.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { showId: show._id },
            }
          );
      res.status(201).json({
        success: true,
        message: "Show registered successfully !!",
        data: show,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Show registration unsuccessful !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getShowsHandler = async (req, res) => {
    try {
      const shows = await getShowsService();
      res.status(200).json({
        success: true,
        message: "Shows fetched successfully !!",
        data: shows,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch shows !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getShowByIdHandler = async (req, res) => {
    try {
      const show = await getShowByIdService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Show fetched successfully !!",
        data: show,
        error: "",
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: "Show not found !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const updateShowHandler = async (req, res) => {
    try {
      const updated = await updateShowService(req.params.id, req.body);
       await publishGeneralMessage(
            notificationTypes.SHOW_UPDATED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "New Show Updated",
              message: `Show "${updated.showTime}" for ${updated.movie} has been successfully updated.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { showId: updated._id },
            }
          );
      res.status(200).json({
        success: true,
        message: "Show updated successfully !!",
        data: updated,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to update show !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const deleteShowHandler = async (req, res) => {
    try {
      const deleted = await deleteShowService(req.params.id);
      await publishGeneralMessage(
            notificationTypes.SHOW_DELETED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "New Show Deleted",
              message: `Show "${deleted.showTime}" for ${deleted.movie} has been successfully deleted.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { deletedId: deleted._id },
            }
          );
      res.status(200).json({
        success: true,
        message: "Show deleted successfully !!",
        data: deleted,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to delete show !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  module.exports = {
    postShowHandler,
    getShowsHandler,
    getShowByIdHandler,
    updateShowHandler,
    deleteShowHandler,
  };
  