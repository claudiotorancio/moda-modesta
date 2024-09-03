import { Schema, model } from "mongoose";

const VistaSchema = new Schema(
  {
    role: { type: String },
    name: { type: String },
    price: { type: Number },
    imagePath: [{ type: String }], // Cambiado a un array de strings
    description: { type: String },
    section: { type: String },
    isFeatured: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
    created_at: { type: Date, default: Date.now },
    sizes: [String],
  },
  {
    versionKey: false,
  }
);

export default model("Vista", VistaSchema);
