const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://:123456@localhost:6379', {
  lazyConnect: false, // immediately connect on startup
  maxRetriesPerRequest: null, // allow queued commands during reconnect
  enableReadyCheck: true,
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) return true;
    return false;
  },
  retryStrategy(times) {
    // exponential backoff: 50ms, 100ms, 200ms ... capped at 2s
    return Math.min(times * 50, 2000);
  },
  keepAlive: 30000,
  connectTimeout: 10000,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', err => console.error('Redis error:', err));
redis.on('close', () => console.warn('Redis connection closed'));
redis.on('reconnecting', () => console.log('Redis reconnecting...'));

module.exports = redis;
