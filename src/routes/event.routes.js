import { Router } from "express";
import { asyncHandler } from "../utils/handler.js";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  getEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import { adminVerify, authVerify } from "../middlewares/authVerify.middlewares.js";

const router = Router();

router.route("/").get(asyncHandler(fetchEvents));
router.post("/create", authVerify, adminVerify, asyncHandler(createEvent));
router.get("/:id", asyncHandler(getEvent));
router
  .route("/:id", authVerify, adminVerify)
  .patch(asyncHandler(updateEvent))
  .delete(asyncHandler(deleteEvent));

export default router;
