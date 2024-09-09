import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";
import MONGODB_URI from "../../config.js";

const addProductCart = async (req, res) => {
  try {
    const { name, price, imagePath, size, productId } = req.body;

    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Agregar el producto al carrito
    const newProductInCart = new Cart({
      name,
      price,
      imagePath,
      size,
      cantidad: 1,
      productId: productId,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default addProductCart;
