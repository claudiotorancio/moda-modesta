import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const destacadosProduct = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    // Buscar productos que son destacados y que cumplen con las condiciones de stock
    const productosDestacados = await Vista.find({
      isFeatured: true,
      isActive: true,
      section: { $in: ["opcion1", "opcion2", "opcion3"] },
      $or: [
        { generalStock: { $gt: 0 } }, // Productos con generalStock mayor a 0
        { "sizes.stock": { $gt: 0 } }, // O productos con al menos un tamaño con stock mayor a 0
      ],
    });

    // Agregar un console.log para depurar
    console.log("Productos destacados:", productosDestacados);

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
