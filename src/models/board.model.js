import mongoose, { Schema } from "mongoose";

const squareSchema = new Schema(
  {
    id: { type: Number, required: true },
    pos: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    textPos: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  { _id: false }
);

const boardSchema = Schema({
  puzzle: [squareSchema],
  tableId: { type: Schema.Types.ObjectId, ref: "Table" },
});

export const Board = mongoose.model("Board", boardSchema);
