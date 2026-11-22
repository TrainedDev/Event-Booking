import "dotenv/config";
import { Worker } from "bullmq";
import {
  bookingConfirmation,
  eventUpdateNotification,
} from "../services/email.services.js";
import connection from "../config/ioredis.config.js"

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.name);

    if (job.name === "bookingConfirmation") {
      await bookingConfirmation(job);
    } else if (job.name === "eventUpdateNotification") {
      await eventUpdateNotification(job);
    } else {
      throw new Error("Invalid email job");
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("ready", () => {
  console.log("Worker is ready to process jobs");
});

worker.on("active", (job) => {
  console.log("Job started:", job.id);
});

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, error) => {
  console.log("Job failed:", job.id, error.message);
});

worker.on("error", (error) => {
  console.log("Worker error:", error.message);
});

console.log("Email worker is running...");
