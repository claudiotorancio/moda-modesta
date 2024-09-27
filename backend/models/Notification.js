import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  notified: { type: Boolean, default: false }, // Para saber si ya fue notificado
  dateRequested: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
