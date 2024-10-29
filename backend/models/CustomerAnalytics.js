import mongoose, { Schema, model } from "mongoose";

const customerAnalyticsSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  totalSpent: { type: Number, required: true }, // Total gastado por el cliente
  totalOrders: { type: Number, required: true }, // Número total de pedidos
  averageOrderValue: { type: Number, required: true }, // Valor promedio por pedido
  lastOrderDate: { type: Date, required: true }, // Fecha del último pedido
  frecuencia: { type: Number, required: true }, // Añadir frecuencia si es relevante
  valorPromedio: { type: Number, required: true }, // Añadir valor promedio si es relevante
});

export default model("CustomerAnalytic", customerAnalyticsSchema);
