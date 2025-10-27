const redis = require("../config/redis");

// seat lock showId,seat and time period
//show:showIdLockedSeat - > show:123ecec:LockedSeats=[]

const lockSeats = async  (showId,seats,ttl=300)=>{

    const lockKey = `show:${showId}:LockedSeats`;

    const LockedSeats = (await redis.smembers(lockKey)) || [];

    const conflictSeats = seats.filter((seat)=>{
        LockedSeats.includes(seat);
    })

    if (conflictSeats.length>0) throw new Error(`Seats ${conflictSeats.join(',')} are temporarily locked !`);

    await redis.sadd(lockKey,...seats);

    await redis.expire(lockKey,ttl);

    return true;
}

const releaseSeatLock= async (showId,seats)=>{
    const lockKey = `show:${showId}:LockedSeats`;

    await redis.srem(lockKey,...seats);
    return true;
}

const areSeatsLocked = async (showId, seats) => {
    const lockKey = `show:${showId}:lockedSeats`;
    const lockedSeats = await redis.smembers(lockKey);
    return seats.filter(seat => lockedSeats.includes(seat));
  };

  module.exports = { lockSeats, releaseSeatLock, areSeatsLocked };
