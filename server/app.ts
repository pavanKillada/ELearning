import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRoutes from './routes/user.route';
import courseRouter from "./routes/course.route";
require("dotenv").config();
import orderRouter from "./routes/order.route";
import notificationRoute from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// initializing the app
export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(
  cors({
    origin: [`${process.env.ORIGIN}`],
    credentials: true,
  })
);

// routes
app.use("/api/v1", userRoutes, courseRouter, orderRouter, notificationRoute, analyticsRouter, layoutRouter);

// testing api
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(
    `Can't find ${req.originalUrl} on this server!`
  ) as any;
  error.statusCode = 404;
  next(error);
});

app.use(ErrorMiddleware);