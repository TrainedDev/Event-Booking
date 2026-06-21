const {
  newEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
} = require("../services/event.service");

const newEvent = async (req, res) => {
  const eventData = req.body;
  const newEvent = await newEventService(eventData);

  res.status(201).json({
    status: "success",
    message: "Event created successfully",
    data: newEvent,
  });
};

const getAllEvents = async (req, res) => {
  const events = await getAllEventsService();

  res.status(200).json({
    status: "success",
    message: "Events retrieved successfully",
    data: events,
  });
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;
  const event = await getEventByIdService(eventId);

  res.status(200).json({
    status: "success",
    message: "Event retrieved successfully",
    data: event,
  });
};

const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;
  const updatedEvent = await updateEventService(eventId, eventData);

  res.status(200).json({
    status: "success",
    message: "Event updated successfully",
    data: updatedEvent,
  });
};

module.exports = { newEvent, getAllEvents, getEventById, updateEvent };
