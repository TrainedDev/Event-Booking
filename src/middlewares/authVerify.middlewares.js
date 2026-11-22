import jwt from "jsonwebtoken";
import models from "../models/index.cjs";
import { appError } from "../utils/handler.js";
import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;
const { User } = models;

export const authVerify = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      appError("authorization token not found", 401);
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      appError("user not found", 404);
    }

    req.userId = user.id;
    next();
  } catch (error) {
    appError("invalid or expired token", 401);
  }
};

export const adminVerify = async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findByPk(userId);

  if (!user) {
    appError("user not found", 404);
  }

  if (user.role !== "event_organizer") {
    appError("access denied, admin only", 403);
  }

  next();
};
