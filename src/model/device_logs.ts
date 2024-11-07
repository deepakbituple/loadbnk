import mongoose from "mongoose";
interface DeviceLogs {
  controller_id: string;
  devices: {
    device_id: string;
    value: string;
  }[];
  last_seen?: Date;
}

const deviceLogsSchema = new mongoose.Schema<DeviceLogs>(
  {
    controller_id: { type: String, required: true },
    devices: [
      {
        device_id: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    last_seen: { type: Date, default: Date.now },
  },
  {
    timeseries: {
      timeField: "last_seen",
    },
  }
);

const DeviceLogs = mongoose.model<DeviceLogs>("DeviceLogs", deviceLogsSchema);

export default DeviceLogs;
