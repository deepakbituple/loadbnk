import { Request, Response, NextFunction } from "express";
import Device from "../model/command";
import * as CommandService from "../service/command_service";

export const getCommands = async (req: Request, res: Response, next: NextFunction) => {
  const controller = req.query.controller as string;
  if (!controller) {
    res.status(400).json({ message: "Controller name is required. example <ServerURL>/devices?controller=CTR1" });
    return;
  }
  try {
    const commands = await CommandService.getCommands(controller);
    if (commands.length === 0) {
      res.status(404).json({ message: "No devices found for controller " + controller });
      return;
    }
    res.status(200).json(commands);
  } catch (error) {
    next(error);
  }
};

export const saveCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const command = req.body;
    if (!command.controller || !command.code || !command.value) {
      res.status(400).json({ message: "Invalid input. controller, code, value are required fields" });
      return;
    }

    await CommandService.saveCommand(command);
    res.status(200).json({ message: "Device updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = req.params.controller;
    if (!controller) {
      res.status(400).json({ message: "Controller name is required. example <ServerURL>/devices/CTR1" });
      return;
    }

    const commandInput = req.body;
    if (!commandInput.code || !commandInput.value) {
      res.status(400).json({ message: "Bad Request. code and value are required fields" });
      return;
    }

    await CommandService.updateCommand(controller, commandInput);
    res.status(200).json({ message: "Device updated successfully" });
  } catch (error) {
    next(error);
  }
};
