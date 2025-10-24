const Screen = require("../../models/Client/Screen");
const ScreenLayoutTemplate = require("../../models/Client/ScreenLayoutTemplate");
const Theater = require("../../models/Client/Theater");
const redis = require("../../config/redis");
const {cacheOrFetch} = require("../../utils/redisUtility");

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

  await redis.del("screens:all");
  return screen;
};

const getScreensService = async () => {
  return await cacheOrFetch("screens:all", () =>
    Screen.find().populate("theater").sort({ createdAt: -1 })
  );
};

const getScreenByIdService = async (screenId) => {
  return await cacheOrFetch(`screen:${screenId}`, () =>
    Screen.findById(screenId).populate("theater layoutTemplate")
  );
};

const updateScreenService = async (screenId, body) => {
  const { name, layoutTemplateId, seatTypes } = body;

  const screen = await Screen.findById(screenId);
  if (!screen) throw new Error("Screen not found !!");

  const updateData = {};

  if (name) updateData.name = name;

  if (layoutTemplateId) {
    const template = await ScreenLayoutTemplate.findById(layoutTemplateId);
    if (!template) throw new Error("Screen Layout not found !!");

    updateData.layoutTemplate = layoutTemplateId;

    updateData.seats = template.seats.map((seat) => ({
      row: seat.row,
      number: seat.number,
      type: seat.type,
      isAvailable: true,
    }));

    updateData.seatTypes = template.seatTypes.map((seatType) => ({
      type: seatType.type,
      price: seatType.price,
    }));

    updateData.totalSeats = updateData.seats.length;
  }

  if (seatTypes && seatTypes.length > 0) {
    updateData.seatTypes = seatTypes;
  }

  const updated = await Screen.findByIdAndUpdate(screenId, updateData, { new: true });
  if (!updated) throw new Error("Failed to update screen");

  await redis.del(`screen:${screenId}`);
  await redis.del(`screens:all`);

  return updated;
};

const deleteScreenService = async (screenId) => {
  const deleted = await Screen.findByIdAndDelete(screenId);
  if (!deleted) throw new Error("Screen not found for delete");

  await redis.del(`screen:${screenId}`);
  await redis.del("screens:all");
  return deleted;
};

module.exports={
    postScreenService,
    getScreensService,
    getScreenByIdService,
    updateScreenService,
    deleteScreenService
}