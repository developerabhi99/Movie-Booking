const notificationMessageType = require("../../constants/notificationMessageType");
const notificationTypes = require("../../constants/notificationTypes");
const { publishGeneralMessage } = require("../../Notification/Producer/generalProducer");

const {
    postScreenLayoutTemplateService,
    getScreenLayoutTemplatesService,
    getScreenLayoutTemplateByIdService,
    updateScreenLayoutTemplateService,
    deleteScreenLayoutTemplateService,
  } = require("../../services/Client/client");
  
  const postScreenLayoutTemplateHandler = async (req, res) => {
    try {
      const template = await postScreenLayoutTemplateService(req.body);
       await publishGeneralMessage(
            notificationTypes.SCREEN_LAYOUT_ADDED,
            [
              notificationMessageType.InAppNotification,
              notificationMessageType.MailNotification,
            ],
            {
              userId: req.user._id,
              title: "New Template Added",
              message: `Template "${template.name}" has been successfully added.`,
              email: req.user._id, // optional if available
              phone: req.user._id, // optional if available
              meta: { templateId: template._id },
            }
          );
      res.status(201).json({
        success: true,
        message: "Screen Layout Template registered successfully !!",
        data: template,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Screen Layout Template registration unsuccessful !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const getScreenLayoutTemplatesHandler = async (req, res) => {
    try {
      const templates = await getScreenLayoutTemplatesService();
      res.status(200).json({
        success: true,
        message: "Screen Layout Templates fetched successfully !!",
        data: templates,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch templates !!",
        data: "",
        error: e.message,
      });
    }
  };
  const getScreenLayoutTemplateByIdHandler = async (req, res) => {
    try {
      const templates = await getScreenLayoutTemplateByIdService();
      res.status(200).json({
        success: true,
        message: "Screen Layout Templates fetched successfully !!",
        data: templates,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch templates !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const updateScreenLayoutTemplateHandler = async (req, res) => {
    try {
      const updated = await updateScreenLayoutTemplateService(req.params.id, req.body);
      await publishGeneralMessage(
        notificationTypes.SCREEN_LAYOUT_UPDATED,
        [
          notificationMessageType.InAppNotification,
          notificationMessageType.MailNotification,
        ],
        {
          userId: req.user._id,
          title: `${updated.name} Screen Layout Updated`,
          message: `${updated.name} Screen has been successfully updated.`,
          email: req.user._id, // optional if available
          phone: req.user._id, // optional if available
          meta: { updatedId: updated._id },
        }
      );
      res.status(200).json({
        success: true,
        message: "Screen Layout Template updated successfully !!",
        data: updated,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to update template !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  const deleteScreenLayoutTemplateHandler = async (req, res) => {
    try {
      const deleted = await deleteScreenLayoutTemplateService(req.params.id);
      await publishGeneralMessage(
        notificationTypes.SCREEN_LAYOUT_DELETED,
        [
          notificationMessageType.InAppNotification,
          notificationMessageType.MailNotification,
        ],
        {
          userId: req.user._id,
          title: `${deleted.name} Layout Deleted`,
          message: `${deleted.name} Layout has been successfully Deleted.`,
          email: req.user._id, // optional if available
          phone: req.user._id, // optional if available
          meta: { deletedId: deleted._id },
        }
      );
      res.status(200).json({
        success: true,
        message: "Screen Layout Template deleted successfully !!",
        data: deleted,
        error: "",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Failed to delete template !!",
        data: "",
        error: e.message,
      });
    }
  };
  
  module.exports = {
    postScreenLayoutTemplateHandler,
    getScreenLayoutTemplatesHandler,
    updateScreenLayoutTemplateHandler,
    deleteScreenLayoutTemplateHandler,
    getScreenLayoutTemplateByIdHandler
  };
  