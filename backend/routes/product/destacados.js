import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Vista from "../../models/Vista.js";

const destacadosProduct = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Buscar productos que son destacados y que pertenecen a las secciones especificadas
    const productosDestacados = await Vista.find({
      "sizes.stock": { $gt: 0 },
      isFeatured: true,
      section: { $in: ["opcion1", "opcion2", "opcion3"] },
    });

    // Enviar los productos destacados como respuesta
    res.json({
      message: "Productos destacados encontrados",
      productosDestacados,
    });
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener productos destacados", error });
  }
};

export default destacadosProduct;
