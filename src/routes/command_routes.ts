import express from "express";
import * as CommandController from "../controller/command_controller";
const router = express.Router();

router.post("/", CommandController.saveCommand);

router.get("/", CommandController.getCommands);

router.put("/:controller", CommandController.updateCommand);

export default router;
