import { Router } from "express";
import { asyncHandler } from "../utils/handler";
import {
  createEvent,
  fetchEvents,
  getEvent,
} from "../controllers/event.controller";
import { adminVerify, authVerify } from "../middlewares/authVerify.middlewares";

const router = Router();

router.route("/").get(asyncHandler(fetchEvents));
router.post("/create", authVerify, adminVerify, asyncHandler(createEvent));
router.get("/:id", asyncHandler(getEvent));
router
  .route("/:id", authVerify, adminVerify)
  .patch(asyncHandler(getEvent))
  .delete(asyncHandler(getEvent));

export default router;
