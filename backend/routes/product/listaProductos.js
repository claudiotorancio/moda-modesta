import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

// Controlador para listar productos
const listaProductos = async (req, res) => {
  console.log(req.user);
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    let query;

    // En desarrollo, permitir productos inactivos
    if (process.env.NODE_ENV === "development") {
      query = {}; // Sin filtros, obtiene todos los productos
    } else {
      query = { isActive: true }; // Solo productos activos en producción
    }

    // Relacionar id de usuario con producto para visualizar solo sus productos
    if (req.isAuthenticated() && req.user.role === "admin") {
      query = { user_id: req.user._id }; // Solo los productos del usuario administrador
    }

    const products = await Vista.find(query).sort({
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
