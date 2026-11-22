import { Router } from "express";
import { asyncHandler } from "../utils/handler";
import { authVerify } from "../middlewares/authVerify.middlewares";
import {
  createBooking,
  fetchBookings,
} from "../controllers/booking.controller";

const router = Router();

router.post("/:id", authVerify, asyncHandler(createBooking));
router.get("/", authVerify, asyncHandler(fetchBookings));

export default router;