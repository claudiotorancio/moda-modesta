//limpiarCarrito.js

import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const limpiarCarrito = async (req, res) => {
  try {
    await connectToDatabase();
    // Eliminar todos los productos del carrito
    const deletedProductsCart = await Cart.deleteMany({});

    // Responder con éxito
    return res.json({ message: "ProductCart deleted", deletedProductsCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default limpiarCarrito;
