import express, { Express, Request, Response, Application, NextFunction } from "express";
import moment from "moment";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import device_route from "./routes/device_routes";
import command_route from "./routes/command_routes";
import * as db from "./service/db";

//For env File

const app: Express = express().use(cors()).use(express.json());
const port = process.env.PORT || 8000;

app.get("/api", async (req: Request, res: Response) => {
  let message = "API server is up";
  // List all environment variables in JSON format
  const env_variables = {
    SERVER_PORT: process.env.PORT,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_NAME: process.env.DATABASE_NAME,
  };
  const dbStatus = await db.status();

  const availableAPIs = [
    {
      GET: ["/api/devices", "/api/devices?controller=CTR1", "/api/commands", "/api/commands?controller=CTR1"],
      POST: ["/api/devices", "/api/devices/bulk", "/api/commands", "/api/commands/bulk"],
      PUT: ["/api/devices/CTR1", "/api/commands/CTR1"],
    },
  ];
  let result = { message, env_variables, dbStatus, availableAPIs };
  res.status(200).json({ result });
});

app.use("/api/devices", device_route);
app.use("/api/commands", command_route);

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

// start the Express server
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
