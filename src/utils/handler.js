export const appError = (message, status) => {
  const error = new Error(message);
  error.statuscode = status;

  throw error;
};

export const responseUser = (res, status, data) => {
  res.status(status).json(data);
};

export const filterData = (
  eventName,
  totalTickets,
  ticketPrice,
  description,
  location,
) => {
  const data = {};
  if (eventName) data.eventName = eventName;
  if (totalTickets) data.totalTickets = totalTickets;
  if (ticketPrice) data.ticketPrice = ticketPrice;
  if (description) data.description = description;
  if (location) data.location = location;

  return data;
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
};
