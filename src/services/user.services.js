import jwt from "jsonwebtoken";
import models from "../models/index.cjs";
import bcrypt from "bcrypt";
import { appError } from "../utils/handler.js";
import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;
const { User } = models;

export const loginService = async (email, password) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });

  if (!user) appError("invalid credentials", 400);

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) appError("invalid credentials", 400);

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

  return { msg: "user successfully logged In", data: token };
};

export const registerService = async (email, password, username, role) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });

  if (user) appError("user already exist with this email", 400);

  const newUser = await User.create({ email, password, username, role });

  const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

  return { msg: "user successfully registered In", data: token };
};
