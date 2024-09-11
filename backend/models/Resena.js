import { Schema, model } from "mongoose";

const ResenaSchema = new Schema(
  {
    name: { type: String, required: true },
    redSocial: { type: String, required: true },
    resena: { type: String, required: true },
    estrellas: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export default model("Resena", ResenaSchema);
