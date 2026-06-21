const { Router } = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { authVerify, authorizeRoles } = require("../middleware/authVerify");
const asyncHandler = require("../middleware/asyncHandler");

const route = Router();

route
  .post("/", authVerify, authorizeRoles, asyncHandler(createEvent))
  .get("/", asyncHandler(getEvents))
  .get("/:id", asyncHandler(getEventById))
  .put("/:id", authVerify, authorizeRoles, asyncHandler(updateEvent))
  .delete("/:id", authVerify, authorizeRoles, asyncHandler(deleteEvent));

module.exports = route;
