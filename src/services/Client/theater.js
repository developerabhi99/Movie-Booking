const Theater = require("../../models/Client/Theater");
const {cacheOrFetch} = require("../../utils/redisUtility");
const redis = require("../../config/redis");


const postTheaterService = async (body) => {
  const { owner, name, location, city, state, pincode } = body;

  const theaterData = {
    name,
    location,
    city,
    owner,
  };

  if (state) theaterData.state = state;
  if (pincode) theaterData.pincode = pincode;

  const theater = await Theater.create(theaterData);
  redis.del("theaters:all");
  return theater;
};

const getTheatersService = async () => {
  return await cacheOrFetch("theaters:all", () =>
    Theater.find().sort({ createdAt: -1 })
  );
};

const getTheaterByIdService = async (theaterId) => {
  return await cacheOrFetch(`theater:${theaterId}`, () =>
    Theater.findById(theaterId)
  );
};

const updateTheaterService = async (theaterId, body) => {
  const { owner, name, location, city, state, pincode } = body;

  const theaterData = {};

  if (owner) theaterData.owner = owner;
  if (name) theaterData.name = name;
  if (location) theaterData.location = location;
  if (city) theaterData.city = city;
  if (state) theaterData.state = state;
  if (pincode) theaterData.pincode = pincode;

  const updated = await Theater.findByIdAndUpdate(theaterId, theaterData, { new: true });
  if (!updated) throw new Error("Theater not found for update");

  await redis.del(`theater:${theaterId}`);
  await redis.del("theaters:all");

  return updated;
};

const deleteTheaterService = async (theaterId) => {
  const deleted = await Theater.findByIdAndDelete(theaterId);
  if (!deleted) throw new Error("Theater not found for delete");

  await redis.del(`theater:${theaterId}`);
  await redis.del("theaters:all");
  return deleted;
};

module.exports={
    postTheaterService,
    getTheatersService,
    getTheaterByIdService,
    updateTheaterService,
    deleteTheaterService
}