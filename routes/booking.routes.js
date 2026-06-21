const { Router } = require("express");
const {
  newBooking,
  getAllBookings,
  getBookingById,
} = require("../controllers/booking.controller");
const { authVerify } = require("../middleware/authVerify");
const { asyncHandler } = require("../utils/handler");


const route = Router();

route
  .post("/", authVerify, asyncHandler(newBooking))
  .get("/", asyncHandler(getAllBookings))
  .get("/:id", asyncHandler(getBookingById));

module.exports = route;
