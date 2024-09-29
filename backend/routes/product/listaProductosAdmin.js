import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const listaProductosAdmin = async (req, res) => {
  try {
    //Relacionar id de usuario con producto para visualizar solo sus productos
    const user_id = req.user._id;

    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    let products;
    //Verificar si el usuario es administrador
    if (req.user.role === "admin") {
      // Si es administrador, buscar productos utilizando el modelo Vista
      products = await Vista.find({ user_id: user_id });
    } else {
      //   //   // Si no es administrador, buscar productos utilizando el modelo Product
      products = await Product.find({ user_id: user_id });
    }

    res.json(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductosAdmin;
