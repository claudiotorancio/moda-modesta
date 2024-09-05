import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Order from "../../models/Order.js";

const deleteCompra = async (req, res) => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener el ID del usuario a eliminar
    const userId = req.params.id;

    // Buscar y eliminar el usuario por su ID
    const deletedUser = await Order.findByIdAndDelete(userId);

    // Usuario eliminado con éxito
    return res.json({ message: "User deleted", deletedUser });
  } catch (error) {
    // Manejar errores durante la eliminación del usuario
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteCompra;
