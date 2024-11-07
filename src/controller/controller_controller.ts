import { Request, Response, NextFunction } from "express";
import Controller from "../model/controller";
import * as ControllerService from "../service/controller_service";

export const getControllers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controllers: Controller[] = await ControllerService.get();
    if (controllers.length === 0) {
      res.status(404).json({ message: "No controllers found" });
      return;
    }
    res.status(200).json(controllers);
  } catch (error) {
    next(error);
  }
};

export const getControllerByControllerId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controllerId = req.params.controller;
    const controller: Controller = await ControllerService.getByControllerId(controllerId);
    if (!controller) {
      res.status(404).json({ message: "Controller not found with name " + req.params.controller });
      return;
    }
    res.status(200).json(controller);
  } catch (error) {
    next(error);
  }
};

export const createController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = req.body;
    if (!controller) {
      res.status(400).json({ message: "Invalid input. Controller is required" });
      return;
    }
    await ControllerService.createController(controller);
    res.status(201).json({ message: "Controller created successfully" });
  } catch (error) {
    next(error);
  }
};

export const addDeviceToController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controllerId = req.params.controller;
    const device = req.body;
    if (!device) {
      res.status(400).json({ message: "Invalid input. Device is required" });
      return;
    }
    await ControllerService.addDeviceToController(controllerId, device);
    res.status(200).json({ message: "Device added to controller" });
  } catch (error) {
    next(error);
  }
};

export const changeDeviceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controllerId = req.params.controller;
    const device_id = req.params.device;
    const enabled = req.body.enabled;
    if (enabled === undefined) {
      res.status(400).json({ message: "Invalid input. enabled is required" });
      return;
    }
    await ControllerService.changeDeviceStatus(controllerId, device_id, enabled);
    res.status(200).json({ message: "Device status updated" });
  } catch (error) {
    next(error);
  }
};

export const updateDeviceState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controllerId = req.params.controller;
    const values = req.body.values;
    if (values === undefined) {
      res.status(400).json({ message: "Invalid input for updateDeviceState. values is required" });
      return;
    }
    await ControllerService.updateDeviceStatus(controllerId, values);
    res.status(200).json({ message: "Device state updated" });
  } catch (error) {
    next(error);
  }
};

export const reloadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ControllerService.reload();
    res.status(200).json({ message: "Controller reloaded" });
  } catch (error) {
    next(error);
  }
};
