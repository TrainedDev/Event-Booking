const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");
const { sequelize } = require("./models");

const app = express();

config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(globalErrorHandler);

sequelize
  .authentication()
  .than(() => console.log("successfully connected to db"))
  .catch((error) => console.log("failed to connect db: ", error));

module.exports = app;
