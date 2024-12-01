import { redis } from "../app.js";

export const setCacheWithExpiry = async (key, value, expirySeconds = 3600) => {
  try {
    await redis.setEx(key, expirySeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
};
