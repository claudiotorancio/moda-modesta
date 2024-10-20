// import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const listaProductos = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    let query = { isActive: true };

    // Relacionar id de usuario con producto para visualizar solo sus productos
    if (req.isAuthenticated()) {
      if (req.user.role === "admin") {
        query = { user_id: req.user._id };
      }
    }

    const products = await Vista.find(query).sort({
      // Ordenar productos por stock: primero los que tienen stock
      generalStock: -1, // Productos con generalStock mayor a 0 primero
      "sizes.stock": -1, // Si generalStock es 0, ordenar por stock en talles
    });

    res.json(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductos;
