import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import { authVerify } from "../middlewares/authVerify.middlewares.js";
import {
  createBooking,
  fetchBookings,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/:id", authVerify, asyncHandler(createBooking));
router.get("/", authVerify, asyncHandler(fetchBookings));

export default router;