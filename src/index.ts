import express, { Express, Request, Response, Application, NextFunction } from "express";
import moment from "moment";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import device_route from "./routes/device_routes";
import command_route from "./routes/command_routes";
import controller_route from "./routes/controller_routes";
import * as MQTTService from "./service/mqtt_service";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// import * as db from "./service/db";
import mongoose from "mongoose";

//For env File

const port = process.env.PORT || 8000;
const app: Express = express().use(cors()).use(express.json());

const httpServer = createServer(app);
export const io = new Server(httpServer);
io.listen(Number(8000), {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket: Socket) => {
  console.log("A client connected");

  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.get("/api", async (req: Request, res: Response) => {
  let message = "API server is up";
  res.status(200).json({ message });
});

app.use("/api/devices", device_route);
app.use("/api/commands", command_route);
app.use("/api/controllers", controller_route);

// create generic error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    message: "IN error block. Something went wrong",
    error: err.message + " " + err.stack + " " + err.name + " " + err.toString() + " ",
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  });
});

// handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception", error);
  // process.exit(1);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  console.error("Unhandled Rejection", error);
  // process.exit(1);
});

const start = async () => {
  try {
    console.log("Connecting to database", process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL || "");
    console.log("Connected to database");
    console.log("Starting server");
    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });
    MQTTService.startMQTTClient();
  } catch (error) {
    console.error(error);
  }
};

start();

// start the Express server
