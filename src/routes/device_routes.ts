import express from "express";
const router = express.Router();
import * as DeviceController from "../controller/device_controller";

// router.post("/", DeviceController.createDevice);

router.post("/bulk", DeviceController.createMultipleDevices);

router.get("/:controller", DeviceController.getDevices);

router.delete("/:controller/:device", DeviceController.deleteDevice);

export default router;
