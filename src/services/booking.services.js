import models from "../models/index.cjs";
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
  if (!Number.isInteger(totalBoughtTickets) || totalBoughtTickets < 1) {
    appError("invalid ticket quantity", 400);
  }

  const booking = await sequelize.transaction(async (t) => {
    const event = await Event.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!event) appError("event not found", 404);

    if (totalBoughtTickets > event.totalTickets) {
      appError("not enough tickets", 400);
    }

    const totalBoughtTicketPrice = Math.round(
      Number(totalBoughtTickets) * Number(event.ticketPrice) * 100,
    );

    const newBooking = await Booking.create(
      {
        totalBoughtTicketPrice,
        eventId: id,
        userId,
        totalBoughtTickets,
      },
      { transaction: t },
    );

    event.totalTickets -= totalBoughtTickets;

    await event.save({ transaction: t });

    return newBooking;
  });

  const bookingDetails = await Booking.findByPk(booking.id, {
    include: [
      { model: Event, as: "userBookedEvents" },
      { model: User, as: "user" },
    ],
  });

  const {
    totalBoughtTicketPrice,
    totalBoughtTickets: bookedTickets,
    userBookedEvents: { eventName },
    user: { username, email },
  } = bookingDetails;

  const job = await emailQueue.add(
    "bookingConfirmation",
    {
      email,
      username,
      eventName,
      totalBoughtTickets: bookedTickets,
      totalBoughtTicketPrice: totalBoughtTicketPrice / 100,
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


  return {
    msg: "booking successfully created",
    data: booking,
  };
};

export const fetchBookingsService = async (userId) => {
  const bookings = await fetchUserBookingsDetails(userId);
  return { msg: "bookings successfully fetched", data: bookings };
};
