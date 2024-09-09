import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Cart from "../../models/Cart.js";

const putProductCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const { cantidad } = req.body; // Corregido: se cambia 'prodcutId' a 'productId' para ser coherente con el context
    // Conexión a la base de datos

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Buscar el producto en el carrito
    const productFind = await Cart.findById(productId);

    if (!productFind) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Actualizar el producto en el carrito
    const updatedProduct = await Cart.findByIdAndUpdate(
      productId,
      { cantidad: cantidad },

      { new: true }
    );
    res.json({
      message: `El producto: ${updatedProduct.name} fue actualizado`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default putProductCart;
