import mongoose, { Schema, model } from "mongoose";

const salesSchema = new Schema(
  {
    date: { type: Date, required: true }, // Fecha de la venta
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vista",
      required: true,
    }, // ID del producto vendido
    quantity: { type: Number, required: true }, // Cantidad vendida
    totalPrice: { type: Number, required: true }, // Precio total de la venta
    discount: { type: Number, required: true }, // Descuento aplicado
    category: { type: String, required: true }, // Categoría del producto
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Cliente que realizó la compra
    compraConfirmada: { type: Boolean, default: false }, // Confirmación de compra
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Relación con la orden
    },
    // Nuevos campos añadidos para almacenar datos del producto al momento de la venta
    name: { type: String, required: true }, // Nombre del producto al momento de la venta
    price: { type: Number, required: true }, // Precio del producto al momento de la venta
    size: { type: String, required: true }, // Tamaño del producto al momento de la venta
    hash: { type: String, required: true }, // Hash o link del producto
  },
  { timestamps: true }
);

export default model("Sale", salesSchema);
