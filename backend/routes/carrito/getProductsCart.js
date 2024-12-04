import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";
import Vista from "../../models/Vista.js";

const getProductsCart = async (req, res) => {
  try {
    const userId = req.isAuthenticated() ? req.user._id : null;
    const sessionId = req.query.sessionId || null;

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "No se proporcionó userId ni sessionId" });
    }

    await connectToDatabase();

    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(200).json({
        message: "El carrito está vacío",
        items: [],
        totalPrice: 0,
      });
    }

    // **Obtenemos los productId de los items en el carrito**
    const productIds = cart.items.map((item) => item.productId);

    // **Buscamos en Vista los registros con estos productId**
    const vistas = await Vista.find({ _id: { $in: productIds } });

    if (!vistas || vistas.length === 0) {
      return res.status(404).json({
        message: "No se encontraron vistas para los productos del carrito",
      });
    }

    // **Actualizamos isActive en los items del carrito**
    cart.items = cart.items.map((item) => {
      const vista = vistas.find((v) => v._id.equals(item.productId));
      if (vista) {
        item.isActive = vista.isActive; // Actualizamos el campo isActive
      }
      return item;
    });

    await cart.save(); // Guardamos los cambios en la base de datos

    res.json({
      message: "Productos en el carrito obtenidos y sincronizados con éxito",
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export default getProductsCart;
