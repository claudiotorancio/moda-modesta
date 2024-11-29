import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const deleteProductCart = async (req, res) => {
  try {
    const { sessionId, id } = req.body; // `id` es el ID del producto en el array `items`.
    const userId = req.isAuthenticated() ? req.user._id : null;

    // console.log("Producto ID:", id);
    // console.log("Session ID:", sessionId);
    // console.log("User ID:", userId);

    await connectToDatabase();

    // Determinar los criterios de búsqueda (userId o sessionId)
    const searchCriteria = userId ? { userId } : { sessionId };

    // Obtener el carrito para encontrar el producto antes de eliminarlo
    const cart = await Cart.findOne(searchCriteria);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Obtener los datos del producto eliminado
    const deletedProduct = cart.items.find(
      (item) => item._id.toString() === id
    );

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Buscar y eliminar el producto del carrito usando $pull
    const updatedCart = await Cart.findOneAndUpdate(
      searchCriteria,
      { $pull: { items: { _id: id } } },
      { new: true } // Retorna el carrito actualizado
    );

    // Actualizar el estado 'inCart' del producto en el modelo Vista
    await Vista.updateOne(
      { _id: deletedProduct.productId },
      { $set: { inCart: false } }
    );

    // Obtener información del producto actualizado
    const updatedProduct = await Vista.findById(deletedProduct.productId);

    return res.json({
      message: "Producto eliminado del carrito y Vista actualizada",
      deletedProduct,
      updatedCart, // Devuelve el carrito actualizado
      updatedProduct, // Devuelve información del producto actualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default deleteProductCart;
