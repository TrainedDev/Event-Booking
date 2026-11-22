import { loginService, registerService } from "../services/user.services.js";
import { appError, responseUser } from "../utils/handler.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) appError("required details not found", 400);

  const response = await loginService(email, password);

  responseUser(res, 200, response);
};

export const register = async (req, res) => {
  const { email, password, role, username } = req.body;

  if (!email || !password || !role || !username)
    appError("required details not found", 400);

  const response = await registerService(email, password, username, role);

  responseUser(res, 201, response);
};
