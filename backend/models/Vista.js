import { Schema, model } from "mongoose";

// Subdocumento para representar cada talla y su stock
const SizeSchema = new Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const VistaSchema = new Schema(
  {
    role: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Nuevo campo para el descuento
    imagePath: [String], // Array de strings para las rutas de imágenes
    description: { type: String, required: true },
    section: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, ref: "Users" }, // Referencia al usuario
    created_at: { type: Date, default: Date.now },
    sizes: [SizeSchema], // Array de subdocumentos que contienen talla y stock
    generalStock: { type: Number, default: 0 }, // Stock general para productos sin tallas (como "Diversos")
    inCart: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // Campo para activar/desactivar
  },
  {
    versionKey: false,
  }
);

export default model("Vista", VistaSchema);
