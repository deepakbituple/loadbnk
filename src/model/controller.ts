import mongoose from "mongoose";
interface Controller {
  _id?: string;
  controller_id: string;
  name: string;
  type: string;
  devices: {
    device_id: string;
    name: string;
    type: string;
    enabled: boolean;
    value?: string;
    last_seen?: Date;
  }[];
}

// create mongoose schema using above interface
const controllerSchema = new mongoose.Schema<Controller>({
  controller_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  devices: [
    {
      device_id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      enabled: { type: Boolean, required: true },
      value: { type: String },
      last_seen: { type: Date },
    },
  ],
});

// create mongoose model using above schema
const Controller = mongoose.model<Controller>("Controller", controllerSchema);

export default Controller;
