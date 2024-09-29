import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const activarProducto = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    const productId = req.params.id;

    // Encontrar el producto y marcarlo como inactivo
    const producto = await Vista.findById(productId);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar el estado del producto para desactivarlo
    producto.isActive = true;
    await producto.save();

    res.json({ message: "Producto desactivado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default activarProducto;
