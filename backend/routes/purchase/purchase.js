import Order from "../../models/Order.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const purchaseOrder = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

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
