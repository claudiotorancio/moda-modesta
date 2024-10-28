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
    category: { type: String, required: true }, // Categoría del producto
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    }, // Cliente que realizó la compra
    compraConfirmada: { type: Boolean, default: false }, // Confirmación de compra
    orderId: {
      // Agregar el campo orderId
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Asegúrate de que coincida con el nombre del modelo de tu orden
      required: true, // O puedes hacerlo opcional según tus necesidades
    },
  },
  { timestamps: true }
);

export default model("Sale", salesSchema);
