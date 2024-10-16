import express from "express";
const router = express.Router();
import * as DeviceController from "../controller/device_controller";

router.post("/", DeviceController.createDevice);

router.get("/", DeviceController.getDevices);

router.put("/:controller", DeviceController.updateDevices);

export default router;
