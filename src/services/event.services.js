import models from "../models/index.js";
import { emailQueue } from "../queues/email.queues.js";
import { appError, responseUser } from "../utils/handler.js";

const { User, Event, Bookings } = models;

export const createEventService = async (
  eventName,
  totalTickets,
  ticketPrice,
  description,
  location,
  userId,
) => {
  const newEvent = await Event.create({
    eventName,
    totalTickets,
    ticketPrice,
    description,
    location,
    userId,
  });

  return { msg: "event successfully created", data: newEvent };
};

export const updateEventService = async (data) => {
  const [updatedRows, event] = await Event.update(data, {
    where: { id },
    returning: true,
  });

  if (updatedRows === 0) appError("event not found", 400);

  const { eventName, ticketPrice, totalTickets, description, location, id } =
    event[0];
  const users = await Event.findAll({
    where: { id },
    include: [
      {
        model: Bookings,
        as: "customers",
        include: [{ model: User, as: "user" }],
      },
    ],
  });

  for (const user of users.customers.users) {
    const { email, username } = user;
    await emailQueue.add("sendMail", {
      eventName,
      ticketPrice,
      totalTickets,
      description,
      location,
      email,
      username,
    });
  }
  return { msg: "event successfully updated", data: updateEvent };
};

export const fetchEventsService = async () => {
  const events = await Event.findAll();

  return { msg: "events successfully fetched", data: events };
};

export const getEventService = async (id) => {
  const event = await Event.findByPk(id);

  return { msg: "event successfully fetched", data: event };
};

export const deleteEventService = async (id) => {
  const event = await Event.destroy({ where: { id } });

  return { msg: "event successfully deleted" };
};
