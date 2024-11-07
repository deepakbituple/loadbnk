import express from "express";
import * as CommandController from "../controller/command_controller";
const router = express.Router();

// router.post("/", CommandController.createCommand);

// router.post("/bulk", CommandController.createMultipleCommands);

// router.get("/", CommandController.getCommands);

router.put("/:controller/:device", CommandController.saveCommand);

export default router;
