import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const putProductCart = async (req, res) => {
  try {
    const { cantidad, productId, sessionId } = req.body;
    // console.log("putProductCart", req.body);

    // Conexión a la base de datos
    await connectToDatabase();

    // Determinar el userId si el usuario está autenticado
    const userId = req.isAuthenticated() ? req.user._id : null;

    // Buscar el carrito correspondiente (por sessionId o userId)
    const cart = await Cart.findOne(userId ? { userId } : { sessionId });
    // console.log(cart);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Buscar el producto dentro del array de items
    const product = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    // console.log("producto", product);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Actualizar la cantidad del producto
    product.cantidad = cantidad;

    // Recalcular el precio total del carrito
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.cantidad,
      0
    );

    // Guardar el carrito actualizado
    await cart.save();

    res.json({
      message: `La cantidad del producto: ${product.name} fue actualizada`,
      product,
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default putProductCart;
