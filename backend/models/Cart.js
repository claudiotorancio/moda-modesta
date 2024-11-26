//modelo para productos

import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imagePath: { type: String, required: true },
    cantidad: { type: Number, required: true, default: 1 },
    discount: { type: Number, default: 0 }, // Nuevo campo para el descuento
    unidad: { type: String, required: true }, // Cambiado a String si se trata de tallas como "S", "M", etc.
    productId: { type: Schema.Types.ObjectId, ref: "Vista", required: true }, // Usando ObjectId y referencia a otra colección
    category: { type: String, required: true }, // Categoría del producto
    isActive: { type: Boolean },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export default model("Cart", CartSchema);
