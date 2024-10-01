// import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const listaProductos = async (req, res) => {
  try {
    //Relacionar id de usuario con producto para visualizar solo sus productos

    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    let products;

    if (req.isAuthenticated()) {
      // El usuario está autenticado, ahora verificamos su rol
      if (req.user.role === "admin") {
        // Si el usuario es administrador, obtener todos los productos (o los productos de administrador)
        const user_id = req.user._id;
        products = await Vista.find({ user_id: user_id });
      } else {
        //   // Si no es administrador, obtener solo los productos del usuario
        products = await Vista.find({ isActive: true });
      }
    } else {
      // Si el usuario no está autenticado, cargar productos con una condición predeterminada
      products = await Vista.find({ isActive: true });
    }

    res.json(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductos;
