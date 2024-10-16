import express, { Express, Request, Response, Application, NextFunction } from "express";
import moment from "moment";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import device_route from "./routes/device_routes";
import command_route from "./routes/command_routes";

//For env File

const app: Express = express().use(cors()).use(express.json());
const port = process.env.PORT || 8000;

app.use("/api/devices", device_route);
app.use("/api/commands", command_route);

// create generic error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    message: "IN error block. Something went wrong",
    error: err.message,
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

// start the Express server
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
