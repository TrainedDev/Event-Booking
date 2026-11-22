import { appError, responseUser } from "../utils/handler.js";

export const createBooking = async (req, res) => {
  const { totalBoughtTickets, totalBoughtTicketPrice } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  if (!totalBoughtTicketPrice || !totalBoughtTickets)
    appError("required details not found", 400);

  const response = await createBookingService(
    totalBoughtTickets,
    id,
    userId,
  );

  responseUser(res, 201, response);
};

export const fetchBookings = async (req, res) => {
  const userId = req.userId;

  const response = await fetchBookingsService(userId);

  responseUser(res, 200, response);
};
