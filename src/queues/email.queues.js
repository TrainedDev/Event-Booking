import { Queue } from "bullmq";
import redis from "../config/redis.config.js"

export const emailQueue = new Queue("emailQueue", {
  connection: redis,
});
