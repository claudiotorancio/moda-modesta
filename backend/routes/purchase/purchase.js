import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Order from "../../models/Order.js";

const purchaseOrder = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener el listado de usuarios
    const order = await Order.find();

    // Retornar el listado de usuarios
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default purchaseOrder;
