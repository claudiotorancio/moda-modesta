import mongoose, { Schema, model } from "mongoose";

const topSellingProductSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  totalSales: { type: Number, required: true }, // Total de ventas acumuladas
  period: { type: String, required: true }, // Período de tiempo (por ejemplo, 'weekly', 'monthly')
});

export default model("TopSellingProduct", topSellingProductSchema);
