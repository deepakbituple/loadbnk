import DeviceLogs from "../model/device_logs";

export const create = async (controller_id: string, deviceData: any): Promise<boolean> => {
  console.log("controller_id", controller_id, "deviceData", deviceData);
  if (!controller_id) {
    throw new Error("Controller is required");
  }
  if (!deviceData) {
    throw new Error("Device data is required");
  }
  const deviceLogsArray = Object.keys(deviceData).map((key: string) => {
    return {
      device_id: key,
      value: deviceData[key],
    };
  });
  console.log("deviceLogsArray", deviceLogsArray);
  const deviceLogs = {
    controller_id: controller_id,
    devices: deviceLogsArray,
  };
  try {
    await DeviceLogs.create(deviceLogs);
    return true;
  } catch (error) {
    console.error("Error creating device in database", error);
    throw error;
  }
};

export const get = async (controller: string, start?: Date, end?: Date): Promise<any> => {
  if (!controller) {
    throw new Error("Controller is required");
  }
  start = start || new Date();
  end = end || new Date();
  try {
    const deviceLogs = await DeviceLogs.find({ controller_id: controller, last_seen: { $gte: start, $lte: end } });
    return deviceLogs;
  } catch (error) {
    console.error("Error fetching devices from database", error);
    throw error;
  }
};
