import { configDotenv } from "dotenv";
import { createClient } from "redis";
configDotenv();

const redisClient = createClient({ url: process.env.redis_url });

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("end", () => console.log("Redis Client Ended"));
redisClient.on("SIGQUIT", () => {
  redisClient.quit();
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.log(err);
  }
};

export default redisClient;
