// import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const listaProductos = async (req, res) => {
  try {
    //Relacionar id de usuario con producto para visualizar solo sus productos

    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    let query = { isActive: true };

    if (req.isAuthenticated()) {
      if (req.user.role === "admin") {
        query = { user_id: req.user._id };
      }
    }

    const products = await Vista.find(query);

    res.json(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductos;
