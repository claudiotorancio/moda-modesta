import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const limpiarCarrito = async (req, res) => {
  try {
    await connectToDatabase();

    // Obtener todos los productos en el carrito antes de eliminarlos
    const productsInCart = await Cart.find({});

    // Eliminar todos los productos del carrito
    const deletedProductsCart = await Cart.deleteMany({});

    // Actualizar el campo 'inCart' de cada producto en Vista a 'false'
    const productIds = productsInCart.map((product) => product.productId);
    await Vista.updateMany(
      { _id: { $in: productIds } },
      { $set: { inCart: false } }
    );

    // Responder con éxito
    return res.json({
      message: "ProductCart deleted and Vista updated",
      deletedProductsCart,
      updatedProducts: productIds, // Devuelve los IDs de los productos actualizados
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default limpiarCarrito;
