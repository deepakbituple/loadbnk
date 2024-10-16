import { Request, Response, NextFunction } from "express";
import Device from "../model/device";
import * as DeviceService from "../service/device_service";

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
  const controller = req.query.controller as string;
  if (!controller) {
    res.status(400).json({ message: "Controller name is required. example <ServerURL>/devices?controller=CTR1" });
    return;
  }
  try {
    const devices = await DeviceService.getDevices(controller);
    if (devices.length === 0) {
      res.status(404).json({ message: "No devices found for controller " + controller });
      return;
    }
    res.status(200).json(devices);
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device: Device = req.body;
    if (!device.controller || !device.device || !device.type) {
      res.status(400).json({ message: "Invalid input. controller, type, device are required fields" });
      return;
    }
    const result = await DeviceService.createDevice(device);
    res.status(201).json({ result, message: "Device created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = req.params.controller;
    if (!controller) {
      res.status(400).json({ message: "Controller name is required. example <ServerURL>/devices/CTR1" });
      return;
    }

    const errors = validateDeviceInput(req.body);
    if (errors.length > 0) {
      res.status(400).json({ message: "Bad Request", errors });
      return;
    }
    const devicesToUpdate = req.body.map((device: any) => {
      return {
        device: device.device,
        state: device.state,
      };
    });

    await DeviceService.updateDevices(controller, devicesToUpdate);
    res.status(200).json({ message: "Device updated successfully" });
  } catch (error) {
    next(error);
  }
};

const validateDeviceInput = (deviceInput: any) => {
  const errors = [];
  if (!deviceInput || deviceInput.length === 0) {
    errors.push("Invalid Device Input. No devices to update");
  }

  for (const device of deviceInput) {
    if (!device.device || !device.state) {
      errors.push("Invalid Device Input. Either device or state is missing for device " + device.device);
    }
  }

  return errors;
};
