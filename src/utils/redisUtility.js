const redis = require("../config/redis");

const CACHE_TTL = 86400;

const cacheOrFetch = async (key, fetchFunction) => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFunction();
  await redis.set(key, JSON.stringify(data), "EX", CACHE_TTL);
  return data;
};

module.exports={
  cacheOrFetch
}