const appError = require("../utils/appError.utils");
const { Bookings, Events } = require("../models");

const newBookingService = async (bookingData) => {
  const { userId, eventId, totalPrice, totalTickets } = bookingData;

  if (!userId || !eventId || !totalTickets || !totalPrice) {
    appError("All fields are required", 400);
  }

  const event = await Events.findByPk(eventId);
  if (!event) {
    appError("Event not found", 404);
  }

  const newBooking = await Bookings.create({
    userId,
    eventId,
    totalPrice,
    totalTickets,
  });

  return newBooking;
};

const getAllBookingsService = async () => {
  const bookings = await Bookings.findAll();
  return bookings;
};

const getCustomerBookingByIdService = async (bookingId) => {
  const booking = await Bookings.findByPk(bookingId);
  if (!booking) {
    appError("Booking not found", 404);
  }
  const customerBookings = await Bookings.findAll({
    where: {
      userId: booking.userId,
    },
    include: [
      {
        model: Users,
        attributes: ["username"],
        as: "customer_bookings",
      },
      {
        model: Events,
        attributes: ["name", "title", "date", "location", "price"],
        as: "event_bookings",
      },
    ],
  });

  return customerBookings;
};

module.exports = {
  newBookingService,
  getAllBookingsService,
  getCustomerBookingByIdService,
};
