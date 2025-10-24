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
  