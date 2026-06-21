const {
  newBookingService,
  getAllBookingsService,
  getBookingByIdService,
} = require("../services/booking.service");

const newBooking = async (req, res) => {
  const bookingData = req.body;
  const newBooking = await newBookingService(bookingData);

  res.status(201).json({
    status: "success",
    message: "Booking created successfully",
    data: newBooking,
  });
};

const getAllBookings = async (req, res) => {
  const bookings = await getAllBookingsService();

  res.status(200).json({
    status: "success",
    message: "Bookings retrieved successfully",
    data: bookings,
  });
};

const getBookingById = async (req, res) => {
  const bookingId = req.params.id;
  const booking = await getBookingByIdService(bookingId);

  res.status(200).json({
    status: "success",
    message: "Booking retrieved successfully",
    data: booking,
  });
};

module.exports = { newBooking, getAllBookings, getBookingById };
