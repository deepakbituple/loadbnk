import express from "express";
import * as ControllerController from "../controller/controller_controller";
const router = express.Router();

router.get("/", ControllerController.getControllers);

router.get("/:controller", ControllerController.getControllerByControllerId);

router.patch("/:controller", ControllerController.addDeviceToController);

router.post("/", ControllerController.createController);

router.patch("/:controller/:device", ControllerController.changeDeviceStatus);

export default router;
