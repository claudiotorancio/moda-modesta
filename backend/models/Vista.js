import { Schema, model } from "mongoose";

const VistaSchema = new Schema(
  {
    role: { type: String },
    name: { type: String },
    price: { type: Number },
    imagePath: {
      type: [String],
      default: [
        "https://moda-modesta.s3.us-east-2.amazonaws.com/23058b8b-7991-4030-8511-9e137592c1f0.jpg",
        "https://moda-modesta.s3.us-east-2.amazonaws.com/23058b8b-7991-4030-8511-9e137592c1f0.jpg",
      ],
    },
    description: { type: String },
    section: { type: String },
    isFeatured: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
    created_at: { type: Date, default: Date.now },
    sizes: [String],
    inCart: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  }
);

export default model("Vista", VistaSchema);
