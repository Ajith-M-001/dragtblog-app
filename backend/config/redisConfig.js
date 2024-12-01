import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => console.log("Redis Client Connected"));
redis.on("error", (err) => console.log("Redis Client Error", err));

const CACHE_KEYS = {
  USER_PROFILE: "user:profile:",
  PASSWORD_RESET_OTP: "pwd_reset_otp:",
  PASSWORD_RESET_TOKEN: "pwd_reset_token:",
};

const CACHE_TTL = {
  USER_PROFILE: 3600,
  PASSWORD_RESET: 600, // 10 minutes for password reset
};

export const cacheUtils = {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Redis GET Error:", error);
      return null;
    }
  },

  async set(key, data, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error("Redis SET Error:", error);
    }
  },

  async del(key) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Redis DEL Error:", error);
    }
  },
};

export { CACHE_KEYS, CACHE_TTL };
