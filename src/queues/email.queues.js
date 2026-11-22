const { Queue } = require("bullmq");
const { default: redis } = require("../config/redis.config");

export const emailQueue = new Queue("emailQueue", {
  connection: redis,
});