import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Vista from "../../models/Vista.js";

const productoSimilar = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Buscar producto con su id
    const productId = req.params.id;
    const productoBase = await Vista.findById(productId);
    if (!productoBase) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Definir un rango de precios basado en un porcentaje del precio base (por ejemplo, ±20%)
    const porcentajeRango = 0.2; // 20% de margen
    const precioMin = productoBase.price * (1 - porcentajeRango);
    const precioMax = productoBase.price * (1 + porcentajeRango);

    console.log(precioMin, precioMax);

    // Búsqueda de productos similares aleatorios
    const productosSimilares = await Vista.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(productId) }, // Excluye el producto base
          name: productoBase.name, // Filtra por nombre similar
          price: { $gte: precioMin, $lte: precioMax }, // Filtra por rango de precio similar
        },
      },
      { $sample: { size: 3 } }, // Selecciona 3 productos aleatorios
    ]);

    res.json({ message: "Productos encontrados", productosSimilares }); // Enviar los productos similares como respuesta
  } catch (error) {
    console.error("Error al buscar productos similares:", error);
    res.status(500).json({ message: "Error al buscar productos similares" });
  }
};

export default productoSimilar;
