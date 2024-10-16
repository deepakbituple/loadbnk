import { Request, Response, NextFunction } from "express";
import Command from "../model/command";
import * as CommandService from "../service/command_service";

export const getCommands = async (req: Request, res: Response, next: NextFunction) => {
  const controller = req.query.controller as string;
  if (!controller) {
    res.status(400).json({ message: "Controller name is required. example <ServerURL>/commands?controller=CTR1" });
    return;
  }
  try {
    const commands: Command[] = await CommandService.getCommands(controller);
    if (commands.length === 0) {
      res.status(404).json({ message: "No commands found for controller " + controller });
      return;
    }
    res.status(200).json(commands);
  } catch (error) {
    next(error);
  }
};

export const createCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const command: Command = req.body;
    if (!command.controller || !command.code || !command.value) {
      res.status(400).json({ message: "Invalid input. controller, code, value are required fields" });
      return;
    }

    await CommandService.createCommand(command);
    res.status(200).json({ message: "command Created successfully" });
  } catch (error) {
    next(error);
  }
};

export const createMultipleCommands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commands: Command[] = req.body;
    if (!commands || commands.length === 0) {
      res.status(400).json({ message: "Invalid input. No commands to create" });
      return;
    }

    await CommandService.createMultipleCommands(commands);
    res.status(201).json({ message: "commands created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCommand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = req.params.controller;
    if (!controller) {
      res.status(400).json({ message: "Controller name is required. example <ServerURL>/commands/CTR1" });
      return;
    }

    const commandInput = req.body;
    if (!commandInput.code || !commandInput.value) {
      res.status(400).json({ message: "Bad Request. code and value are required fields" });
      return;
    }

    await CommandService.updateCommand(controller, commandInput);
    res.status(200).json({ message: "command updated successfully" });
  } catch (error) {
    next(error);
  }
};
