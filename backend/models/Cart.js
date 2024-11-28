import { Schema, model } from "mongoose";

// Subdocumento: Productos dentro del carrito
const CartItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 1 },
  discount: { type: Number, default: 0 },
  unidad: { type: String, required: true }, // Talla o unidad
  productId: { type: Schema.Types.ObjectId, ref: "Vista", required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean },
  created_at: { type: Date, default: Date.now },
});

// Modelo principal: Carrito
const CartSchema = new Schema(
  {
    sessionId: { type: String, default: null }, // Identificador único para usuarios no logueados
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Usuario logueado
    items: [CartItemSchema], // Array de productos en el carrito
    totalPrice: { type: Number, default: 0 }, // Precio total del carrito
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export default model("Cart", CartSchema);
