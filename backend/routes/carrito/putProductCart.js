import Cart from "../../models/Cart.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const putProductCart = async (req, res) => {
  try {
    const { cantidad, productId } = req.body;
    console.log(req.body);

    // Conexión a la base de datos

    await connectToDatabase();

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
