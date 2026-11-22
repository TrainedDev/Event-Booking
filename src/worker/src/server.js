
import "dotenv/config";
import express from "express";
import "./workers/email.workers.js"

const app = express();

app.get("/worker", (req, res) => {
  res.status(200).json({
    message: "Email worker is running",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Worker health server running on port ${PORT}`);
});
