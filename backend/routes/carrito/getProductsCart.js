import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getProductsCart = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    const productsCart = await Cart.find();

    if (productsCart) {
      res.json({ productsCart });
    } else {
      res.json({ message: "No hay productos en el carrito" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default getProductsCart;
