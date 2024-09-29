import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const destacadosProduct = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    // Buscar productos que son destacados y que pertenecen a las secciones especificadas
    const productosDestacados = await Vista.find({
      "sizes.stock": { $gt: 0 },
      isFeatured: true,
      section: { $in: ["opcion1", "opcion2", "opcion3"] },
      isActive: true,
    });

    // Enviar los productos destacados como respuesta
    res.json(productosDestacados);
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener productos destacados", error });
  }
};

export default destacadosProduct;
