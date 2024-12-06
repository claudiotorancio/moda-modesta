import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vista",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: false },
        hash: { type: String, required: true },
        category: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    destination: {
      province: { type: String, required: false },
      postalCode: { type: String, required: false },
    },
    checked: { type: Boolean, default: false },
    aceptar: { type: Boolean, default: false },
    enCamino: { type: Boolean, default: false },
    finalizado: { type: Boolean, default: false },
    cancelado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
