//limpiarCarrito.js

import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Cart from "../../models/Cart.js";

const limpiarCarrito = async (req, res) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Eliminar todos los productos del carrito
    const deletedProductsCart = await Cart.deleteMany({});

    // Responder con éxito
    return res.json({ message: "ProductCart deleted", deletedProductsCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    // Cerrar la conexión con la base de datos después de la operación
    mongoose.connection.close();
  }
};

export default limpiarCarrito;
