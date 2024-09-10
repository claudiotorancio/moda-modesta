import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";

const deleteProductCart = async (req, res) => {
  try {
    const _id = req.params.id;

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Buscar y eliminar el producto del carrito por su ID
    const deletedProductCart = await Cart.findByIdAndDelete(_id);

    if (!deletedProductCart) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Actualizar el estado 'inCart' del producto en el modelo Vista
    await Vista.updateOne(
      { _id: deletedProductCart.productId },
      { $set: { inCart: false } }
    );

    // Obtener información del producto actualizado
    const updatedProduct = await Vista.findById(deletedProductCart.productId);

    return res.json({
      message: "ProductCart deleted and Vista updated",
      deletedProductCart,
      updatedProduct, // Devuelve información del producto actualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    mongoose.connection.close();
  }
};

export default deleteProductCart;
