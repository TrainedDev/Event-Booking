import models from "../models/index.js";
import { emailQueue } from "../queues/email.queues.js";
import { appError } from "../utils/handler.js";

const { User, Event, Booking, sequelize } = models;

const fetchUserBookingsDetails = async (userId) => {
  const bookings = await Booking.findAll({
    where: { userId },
    include: [
      { model: Event, as: "userBookedEvents" },
      { model: User, as: "user" },
    ],
  });

  return bookings;
};

export const createBookingService = async (totalBoughtTickets, id, userId) => {
  const booking = await sequelize.transaction(async (t) => {
    const event = await Event.findByOk(id, { transaction: t });

    if (!event) appError("event not found", 400);

    if (totalBoughtTickets > event.totalTickets)
      appError("not enough tickets", 400);

    const totalBoughtTicketPrice = totalBoughtTickets * event.ticketPrice;

    const newBooking = await Booking.create(
      {
        totalBoughtTicketPrice,
        eventId: id,
        totalBoughtTickets,
      },
      { transaction: t },
    );

    if (event.totalTickets > 0) {
      event.totalTickets -= totalBoughtTickets;
    } else {
      event.totalTickets = 0;
    }

    event.save();
  });

  const {
    totalBoughtTicketPrice,
    totalBoughtTickets,
    userBookedEvents: { eventName },
    users: { username, email },
  } = fetchUserBookingsDetails(userId);

  await emailQueue.add(
    "sendMail",
    {
      email,
      username,
      eventName,
      totalBoughtTickets,
      totalBoughtTicketPrice,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    },
  );

  return { msg: "booking successfully created", data: booking };
};

export const fetchBookingsService = async (userId) => {
  const bookings = await fetchUserBookingsDetails(userId);
  return { msg: "bookings successfully fetched", data: bookings };
};
