import mongoose from "mongoose";
interface Command {
  device_id: string;
  value: string;
  controller_id: string;
  last_updated?: Date;
}

const commandSchema = new mongoose.Schema<Command>({
  device_id: { type: String, required: true },
  value: { type: String, required: true },
  controller_id: { type: String, required: true },
  last_updated: { type: Date, default: Date.now },
});

const Command = mongoose.model<Command>("Command", commandSchema);

export default Command;
