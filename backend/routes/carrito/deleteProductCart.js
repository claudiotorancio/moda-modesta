import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Cart from "../../models/Cart.js";

const deleteProductCart = async (req, res) => {
  try {
    // Obtener el ID del usuario a eliminar
    const _id = req.params.id;

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Buscar y eliminar el usuario por su ID
    const deletedProductCart = await Cart.findByIdAndDelete(_id);

    // Usuario eliminado con éxito
    return res.json({ message: "ProductCart deleted", deletedProductCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default deleteProductCart;
