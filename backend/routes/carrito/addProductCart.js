import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const addProductCart = async (req, res) => {
  try {
    const {
      name,
      price,
      imagePath,
      unidad,
      productId,
      cantidad,
      category,
      discount,
      isActive,
    } = req.body;
    // Conectar a la base de datos
    await connectToDatabase();

    // Buscar si el producto ya existe en el carrito
    const existingProduct = await Cart.findOne({
      productId: productId,
    });

    if (existingProduct) {
      // Si existe, actualizar la cantidad
      existingProduct.cantidad += cantidad; // Sumar la cantidad recibida
      await existingProduct.save();

      res.json({
        message: "La cantidad del producto fue actualizada con éxito",
        product: existingProduct,
      });
    } else {
      // Si no existe, crear un nuevo producto en el carrito
      const newProductInCart = new Cart({
        name,
        price,
        imagePath,
        unidad,
        cantidad: cantidad, // Usar la cantidad recibida
        productId: productId,
        category: category,
        discount: discount,
        isActive,
      });

      await newProductInCart.save();

      // Actualizar el producto en la colección Vista para indicar que está en el carrito
      const updatedProduct = await Vista.findByIdAndUpdate(
        productId,
        { inCart: true },
        { new: true }
      );

      res.json({
        message: "El producto fue agregado con éxito",
        product: updatedProduct,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default addProductCart;
