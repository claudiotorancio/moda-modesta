import Order from "../../models/Order.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const gefetchPendingOrders = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener órdenes con enCamino: false y finalizado: false
    const pendingOrders = await Order.find({
      finalizado: false,
    });

    // Devolver las órdenes encontradas
    res.json(pendingOrders);
  } catch (error) {
    console.error("Error al obtener el estado:", error);
    res.status(500).json({ error: "Error al obtener el estado" });
  }
};

export default gefetchPendingOrders;
