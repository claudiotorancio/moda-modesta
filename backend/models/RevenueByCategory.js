import { Schema, model } from "mongoose";

const revenueByCategorySchema = new Schema({
  category: { type: String, required: true },
  totalRevenue: { type: Number, required: true }, // Ingresos totales por categoría
  period: { type: String, required: true }, // Período de tiempo (por ejemplo, 'monthly')
});

export default model("TopSellingProduct", revenueByCategorySchema);
