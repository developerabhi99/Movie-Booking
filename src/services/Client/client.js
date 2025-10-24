const ScreenLayoutTemplate = require("../../models/Client/ScreenLayoutTemplate");
const redis = require("../../config/redis"); 
const { cacheOrFetch } = require("../../utils/redisUtility"); 

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

  await redis.del("screenLayoutTemplates:all");

  return template;
};


const getScreenLayoutTemplatesService = async () => {
  return await cacheOrFetch("screenLayoutTemplates:all", () =>
    ScreenLayoutTemplate.find().sort({ createdAt: -1 })
  );
};


const getScreenLayoutTemplateByIdService = async (id) => {
  return await cacheOrFetch(`screenLayoutTemplate:${id}`, () =>
    ScreenLayoutTemplate.findById(id)
  );
};


const updateScreenLayoutTemplateService = async (id, body) => {
  const updateData = {};

  if (body.name) updateData.name = body.name;
  if (body.seats) {
    updateData.seats = body.seats;
    updateData.seatLength = body.seats.length;
  }
  if (body.seatTypes) updateData.seatTypes = body.seatTypes;

  const updated = await ScreenLayoutTemplate.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updated) throw new Error("Template not found or failed to update");

 
  await redis.del(`screenLayoutTemplate:${id}`);
  await redis.del("screenLayoutTemplates:all");

  return updated;
};


const deleteScreenLayoutTemplateService = async (id) => {
  const deleted = await ScreenLayoutTemplate.findByIdAndDelete(id);
  if (!deleted) throw new Error("Template not found for delete");


  await redis.del(`screenLayoutTemplate:${id}`);
  await redis.del("screenLayoutTemplates:all");

  return deleted;
};

module.exports = {
  postScreenLayoutTemplateService,
  getScreenLayoutTemplatesService,
  getScreenLayoutTemplateByIdService,
  updateScreenLayoutTemplateService,
  deleteScreenLayoutTemplateService,
};
