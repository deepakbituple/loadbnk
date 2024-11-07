// Create, update, delete and List functions to Create Device in mongodb

import mqtt from "mqtt/*";
import Device from "../model/device";
import * as MQTTService from "./mqtt_service";

export const get = async (controller: string): Promise<Device[]> => {
  try {
    const devices = await Device.find({ controller: controller });
    return devices;
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  }
};

export const create = async (device: Device): Promise<boolean> => {
  try {
    await Device.create(device);
    return true;
  } catch (error) {
    console.error("Error creating device in database", error);
    throw error;
  }
};

export const createMultiple = async (devices: Device[]): Promise<boolean> => {
  try {
    await Device.insertMany(devices);
    return true;
  } catch (error) {
    console.error("Error creating device in database", error);
    throw error;
  }
};

export const deleteDevice = async (controller: string, device: string): Promise<boolean> => {
  try {
    await Device.deleteOne({ controller: controller, device: device });
    return true;
  } catch (error) {
    console.error("Error deleting device in database", error);
    throw error;
  }
};

export const updateDevicesStatus = async (controller: string, deviceValue: Map<string, string>): Promise<boolean> => {
  try {
    for (const [deviceName, value] of deviceValue) {
      const device = await Device.findOne({ controller: controller, device: deviceName });
      if (!device) {
        // console.warn("Device not found with name " + deviceName);
        continue;
      } else {
        device.value = value;
        device.last_seen = new Date();
        await device.save();
        // MQTTService.publishMessage(device);
      }
    }
    return true;
  } catch (error) {
    console.error("Error updating device status in database", error);
    throw error;
  }
};
