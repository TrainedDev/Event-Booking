const { Router } = require("express");
const { login, register } = require("../controllers/auth.controller");
const { asyncHandler } = require("../utils/handler");
const route = Router();

route.post("/login", asyncHandler(login));
route.post("/register", asyncHandler(register));

module.exports = route;
