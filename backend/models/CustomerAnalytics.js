import mongoose, { Schema, model } from "mongoose";

const customerAnalyticsSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  totalSpent: { type: Number, required: true }, // Total gastado por el cliente
  totalOrders: { type: Number, required: true }, // Número total de pedidos
  averageOrderValue: { type: Number, required: true }, // Valor promedio por pedido
  lastOrderDate: { type: Date, required: true }, // Fecha del último pedido
});
export default model("TopSellingProduct", customerAnalyticsSchema);
