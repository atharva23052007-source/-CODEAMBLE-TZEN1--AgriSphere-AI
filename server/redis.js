import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;
let isConnected = false;

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying if Redis daemon is not running locally
      }
      return Math.min(times * 100, 1000);
    },
    lazyConnect: true
  });

  redisClient.on("connect", () => {
    isConnected = true;
    console.log("[Redis] Connected to Redis server at", redisUrl);
  });

  redisClient.on("ready", () => {
    isConnected = true;
    console.log("[Redis] Redis client ready for commands.");
  });

  redisClient.on("error", (err) => {
    isConnected = false;
    if (err.code === "ECONNREFUSED") {
      console.warn("[Redis Notice] Redis server not running at " + redisUrl + ". Direct live API mode active.");
    } else {
      console.warn("[Redis Error]:", err.message);
    }
  });

  redisClient.on("end", () => {
    isConnected = false;
  });

  // Connect asynchronously without blocking startup
  redisClient.connect().catch(() => {
    // Managed gracefully by error event handler
  });

} catch (err) {
  console.warn("[Redis Service Error]:", err.message);
}

/**
 * Retrieve JSON cached object by key
 */
export async function getCache(key) {
  if (!redisClient || !isConnected) return null;
  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`[Redis Cache Hit] Key: ${key}`);
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[Redis getCache Error] Key: ${key}`, err.message);
  }
  return null;
}

/**
 * Save JSON object in Redis cache with TTL (in seconds)
 */
export async function setCache(key, value, ttlSeconds = 300) {
  if (!redisClient || !isConnected) return false;
  try {
    const jsonStr = JSON.stringify(value);
    await redisClient.set(key, jsonStr, "EX", ttlSeconds);
    console.log(`[Redis Cache Set] Key: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (err) {
    console.warn(`[Redis setCache Error] Key: ${key}`, err.message);
    return false;
  }
}

/**
 * Delete key from Redis cache
 */
export async function delCache(key) {
  if (!redisClient || !isConnected) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.warn(`[Redis delCache Error] Key: ${key}`, err.message);
    return false;
  }
}

/**
 * Returns connection status
 */
export function isRedisConnected() {
  return isConnected;
}

export default redisClient;
