const notificationMessageType = require("../../constants/notificationMessageType");
const notificationTypes = require("../../constants/notificationTypes");
const { publishGeneralMessage } = require("../../Notification/Producer/generalProducer");

const {
    postScreenService,
    getScreensService,
    getScreenByIdService,
    updateScreenService,
    deleteScreenService,
  } = require("../../services/Client/screen");
  
  const postScreenHandler = async (req, res) => {
    try {
      const screen = await postScreenService(req.body);

       await publishGeneralMessage(
            notificationTypes.SCREEN_ADDED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "New Screen Added",
              message: `Screen "${screen.name}" has been successfully added.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { screenId: screen._id },
            }
          );
      res.status(201).json({
        success: true,
        message: "Screen registered successfully !!",
        data: screen,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Screen registration unsuccessful !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getScreensHandler = async (req, res) => {
    try {
      const screens = await getScreensService();
      res.status(200).json({
        success: true,
        message: "Screens fetched successfully !!",
        data: screens,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch screens !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getScreenByIdHandler = async (req, res) => {
    try {
      const screen = await getScreenByIdService(req.params.id);
      res.status(200).json({
        success: true,
        message: "Screen fetched successfully !!",
        data: screen,
        error: "",
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: "Screen not found !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const updateScreenHandler = async (req, res) => {
    try {
      const updated = await updateScreenService(req.params.id, req.body);
       await publishGeneralMessage(
            notificationTypes.SCREEN_UPDATED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: `${updated.name} Screen Updated`,
              message: `${updated.name} Screen has been successfully updated.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { screenId: updated._id },
            }
          );
      res.status(200).json({
        success: true,
        message: "Screen updated successfully !!",
        data: updated,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to update screen !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const deleteScreenHandler = async (req, res) => {
    try {
      const deleted = await deleteScreenService(req.params.id);
      await publishGeneralMessage(
            notificationTypes.SCREEN_DELETED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: `${deleted.name} Screen Deleted`,
              message: `${deleted.name} Screen has been successfully Deleted.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { screenId: deleted._id},
            }
          );
      res.status(200).json({
        success: true,
        message: "Screen deleted successfully !!",
        data: deleted,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to delete screen !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  module.exports = {
    postScreenHandler,
    getScreensHandler,
    getScreenByIdHandler,
    updateScreenHandler,
    deleteScreenHandler,
  };
  