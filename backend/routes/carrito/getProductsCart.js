import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getProductsCart = async (req, res) => {
  try {
    const userId = req.isAuthenticated() ? req.user._id : null;
    const sessionId = req.query.sessionId || null;

    console.log("userId:", userId);
    console.log("sessionId:", sessionId);

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "No se proporcionó userId ni sessionId" });
    }

    await connectToDatabase();

    const query = userId ? { userId } : { sessionId };
    console.log("Buscando carrito con los criterios:", query);

    const cart = await Cart.findOne(query);

    if (!cart || !cart.items || cart.items.length === 0) {
      console.log("Carrito no encontrado o está vacío.");
      // Cambiamos a 200 para evitar que el cliente registre el error como crítico.
      return res.status(200).json({
        message: "El carrito está vacío",
        items: [],
        totalPrice: 0,
      });
    }

    res.json({
      message: "Productos en el carrito obtenidos con éxito",
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export default getProductsCart;
