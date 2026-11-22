import {
  createEventService,
  fetchEventsService,
  getEventService,
  updateEventService,
  deleteEventService,
} from "../services/event.services.js";

import { appError, filterData, responseUser } from "../utils/handler.js";

export const createEvent = async (req, res) => {
  const { eventName, totalTickets, ticketPrice, description, location } =
    req.body;
  const userId = req.userId;

  if (!eventName || !totalTickets || !ticketPrice || !description || !location)
    appError("required detail not found", 400);

  const response = await createEventService(
    eventName,
    totalTickets,
    ticketPrice,
    description,
    location,
    userId,
  );

  responseUser(res, 201, response);
};

export const fetchEvents = async (req, res) => {
  const response = await fetchEventsService();

  responseUser(res, 200, response);
};

export const getEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) appError("required details not found", 400);

  const response = await getEventService();

  responseUser(res, 200, response);
};

export const updateEvent = async (req, res) => {
  const { eventName, totalTickets, ticketPrice, description, location } =
    req.body;
  const { id } = req.params;
  const data = filterData(
    eventName,
    totalTickets,
    ticketPrice,
    description,
    location,
  );
  const response = await updateEventService(data, id);

  responseUser(res, 200, response);
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) appError("required details not found", 400);

  const response = await deleteEventService();

  responseUser(res, 200, response);
};
