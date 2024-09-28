import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const contadorProductos = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    //extraer el id
    const userId = req.params.id;

    // Buscar productos asociados al usuario específico

    const cantidadVistas = await Vista.countDocuments({ user_id: userId });
    // const cantidadProductos = await Product.countDocuments({ user_id: userId });

    res.json({ cantidad: cantidadVistas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default contadorProductos;
