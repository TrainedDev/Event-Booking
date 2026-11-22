import express from "express";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import { errorHandler } from "./utils/handler.js";
import model from "./models/index.cjs";


const app = express();
const { sequelize } = model; 

app.use(express.json());

app.get("/", (req, res) => res.send("server is live"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

sequelize.authenticate().then(()=> console.log("supabase connected")).catch((err)=> console.log(err));

app.use(errorHandler);

export default app;