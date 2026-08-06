import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routes/auth.routes.js";
import planetsRouter from "./routes/planets.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import stargazingRouter from "./routes/stargazing.routes.js";
import observatoriesRouter from "./routes/observatories.routes.js";
import skyEventsRouter from "./routes/skyEvents.routes.js";
import newsRouter from "./routes/news.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CosmoVision API" });
});

app.use("/api/auth", authRouter);
app.use("/api/planets", planetsRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/stargazing", stargazingRouter);
app.use("/api/observatories", observatoriesRouter);
app.use("/api/sky-events", skyEventsRouter);
app.use("/api/news", newsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Khong tim thay endpoint nay" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `[Server] CosmoVision API dang chay tai http://localhost:${PORT}`,
    );
  });
});
