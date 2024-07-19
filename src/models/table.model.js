import mongoose, { Schema } from "mongoose";

const tableSchema = Schema({
  username: { type: String, required: true },
  status: {
    type: String,
    default: "Running",
    enum: ["Running", , "Completed", "Left"],
  },
  socketId: {
    type: String,
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
});

export const Table = mongoose.model("table", tableSchema);
