import Controller from "../model/controller";
import * as MQTTService from "./mqtt_service";

export const get = async (lean = true, enabled = true): Promise<Controller[]> => {
  let controllers: Controller[] = [];
  if (!enabled) {
  }
  try {
    controllers = await Controller.find().lean(lean);
    if (enabled) {
      controllers.forEach((controller) => {
        controller.devices = controller.devices.filter((device) => device.enabled);
      });
    }
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  }
  return controllers;
};

export const getByControllerId = async (controllerId: string, lean = true): Promise<Controller> => {
  let controller: Controller;
  try {
    const result = await Controller.findOne({ controller_id: controllerId }).lean(lean);
    if (!result) {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
    controller = result as Controller;
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  }
  return controller;
};

export const createController = async (controller: any): Promise<boolean> => {
  try {
    console.log("Creating controller", controller);
    const newController = new Controller(controller);
    await newController.save();
    return true;
  } catch (error) {
    console.error("Error creating controller in database", error);
    throw error;
  }
};

export const addDeviceToController = async (controllerId: string, device: any): Promise<boolean> => {
  try {
    console.log("Adding device to controller", controllerId, device);
    const controller = await Controller.findOne({ controller_id: controllerId });
    if (!controller) {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
    if (controller.devices.find((d) => d.device_id === device.device_id)) {
      throw new Error(`Device with id ${device.device_id} already exists in controller`);
    }
    controller.devices.push({ device_id: device.device_id, name: device.name, type: device.type, enabled: false });
    await controller.save();
    // MQTTService.reconnect();
    return true;
  } catch (error) {
    console.error("Error adding device to controller", error);
    throw error;
  }
};

export const changeDeviceStatus = async (
  controllerId: string,
  device_id: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    console.log("Changing device status", controllerId, device_id);
    const controller = await Controller.findOne({ controller_id: controllerId });

    if (!controller) {
      throw new Error(`Controller with id ${controllerId} not found`);
    }
    const deviceIndex = controller.devices.findIndex((d) => d.device_id === device_id);
    if (deviceIndex === -1) {
      throw new Error(`Device with id ${device_id} not found in controller`);
    }
    controller.devices[deviceIndex].enabled = enabled;
    await controller.save();
    MQTTService.reconnect();
    return true;
  } catch (error) {
    console.error("Error changing device status", error);
    throw error;
  }
};

/*
deviceValues = {
  OP1: 'OFF',
  OP2: 'ON',
  OP3: 'ON',
  OP4: 'OFF',
  OP5: 'OFF',
  OP6: 'OFF',
  OP7: 'OFF',
  OP8: 'OFF',
  OP9: 'OFF',
  v: 231
}
*/
export const updateDeviceStatus = async (controllerId: string, deviceValues: any): Promise<Controller> => {
  try {
    console.log("Updating device status in Controller service updateDeviceStatus", controllerId, deviceValues);

    const controller = await Controller.findOne({ controller_id: controllerId });
    if (!controller) {
      throw Error("Controller not found with name " + controllerId);
    }
    controller.devices = controller.devices.map((device) => {
      const value = deviceValues[device.device_id];
      if (value !== undefined) {
        device.value = value;
        device.last_seen = new Date();
      }
      return device;
    });
    await controller.save();

    return controller;
  } catch (error) {
    console.error("Error updating device status in database", error);
    throw error;
  }
};

export const reload = async () => {
  MQTTService.reconnect();
};
