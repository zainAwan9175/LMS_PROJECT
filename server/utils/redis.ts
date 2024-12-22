import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis connected successfully");
        return new Redis(process.env.REDIS_URL); // Correctly initialize Redis client
    }
    throw new Error("Redis connection failed");
};

export const redis = redisClient();
