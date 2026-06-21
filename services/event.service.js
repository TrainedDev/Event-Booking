const { Events } = require("../models");
const appError = require("../utils/appError.utils");

const newEventService = async (eventData) => {
  const { name, description, date, location, price, userId } = eventData;

  if (!name || !description || !date || !location || !price || !userId) {
    appError("All fields are required", 400);
  }
  const newEvent = await Events.create({
    name,
    description,
    date,
    location,
    price,
    userId,
  });

  return newEvent;
};

const getAllEventsService = async () => {
  const events = await Events.findAll({
    includes: [
      {
        model: Users,
        attributes: ["username"],
        as: "event_organizer",
      },
    ],
  });
  return events;
};

const getEventByIdService = async (eventId) => {
  const event = await Events.findByPk(eventId);
  if (!event) {
    appError("Event not found", 404);
  }
  return event;
};

const updateEventService = async (eventId, eventData) => {
  const event = await Events.findByPk(eventId);
  if (!event) {
    appError("Event not found", 404);
  };

    const { name, description, date, location, price } = eventData;

    if (name !== undefined) event.name = name;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (price !== undefined) event.price = price;

    await event.save();
    return event;
};

module.exports = { newEventService, getAllEventsService, getEventByIdService, updateEventService };