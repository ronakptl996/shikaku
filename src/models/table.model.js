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
  dimension: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  totalTime: { type: String, default: null },
  boardId: { type: Schema.Types.ObjectId, ref: "Board" },
});

export const Table = mongoose.model("Table", tableSchema);
