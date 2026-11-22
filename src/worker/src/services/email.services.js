
import { sendEmail } from "../utils/email.utils.js";

export const bookingConfirmation = async (job) => {
  const {
    email,
    username,
    eventName,
    totalBoughtTickets,
    totalBoughtTicketPrice,
  } = job.data;

  //   console.log("BOOKING CONFIRMATION EMAIL:", {
  //   email,
  //   username,
  //   eventName,
  //   totalBoughtTickets,
  //   totalBoughtTicketPrice,
  // });
  const context = `
    <h2>Booking Confirmed!</h2>
    <p>Hello ${username},</p>
    <p>Your booking for <b>${eventName}</b> is confirmed.</p>
    <p>Tickets: ${totalBoughtTickets}</p>
    <p>Total Price: ₹${totalBoughtTicketPrice}</p>
    <p>Thank you for booking with us!</p>
  `;

  await sendEmail(email, "Booking Confirmation", context);
};

export const eventUpdateNotification = async (job) => {
  const {
    email,
    username,
    eventName,
    ticketPrice,
    totalTickets,
    description,
    location,
  } = job.data;

  // console.log("EVENT UPDATE EMAIL:", {
  //   email,
  //   username,
  //   eventName,
  //   ticketPrice,
  //   totalTickets,
  //   description,
  //   location,
  // });

  const context = `
    <h2>Event Update Notification</h2>
    <p>Hello ${username},</p>
    <p>The event <b>${eventName}</b> has been updated.</p>
    <p>Description: ${description}</p>
    <p>Location: ${location}</p>
    <p>Ticket Price: ₹${ticketPrice}</p>
    <p>Available Tickets: ${totalTickets}</p>
  `;

  await sendEmail(email, "Event Updated", context);
};
