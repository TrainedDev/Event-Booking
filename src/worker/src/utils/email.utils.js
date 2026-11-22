import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"Event Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};