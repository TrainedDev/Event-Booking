import { Router } from "express";
import { login, register } from "../controllers/user.controllers.js";
import { asyncHandler } from "../utils/handler.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));

export default router;