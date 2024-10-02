import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Hace referencia al modelo de usuarios
        required: true, // Si deseas que sea obligatorio
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        hash: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    destination: {
      province: { type: String, required: false },
      postalCode: { type: String, required: false },
    },
    checked: { type: Boolean, required: false },
    aceptar: { type: Boolean, required: false },
    enCamino: { type: Boolean, required: false },
    finalizado: { type: Boolean, required: false },
    cancelado: { type: Boolean, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
