import mongoose from "mongoose";
interface Device {
  id: string;
  device_id: string;
  value?: string;
  last_seen?: Date;
  controller: string;
}

// create mongoose schema using above interface

const deviceSchema = new mongoose.Schema<Device>({
  id: { type: String, required: true, unique: true },
  device_id: { type: String, required: true },
  controller: { type: String, required: true },
  value: { type: String },
  last_seen: { type: Date, default: Date.now },
});

// create mongoose model using above schema
const Device = mongoose.model<Device>("Device", deviceSchema);

export default Device;
