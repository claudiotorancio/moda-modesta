import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Vista from "../../models/Vista.js";

// Conectar a la base de datos al iniciar el servidor
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

const productoSimilar = async (req, res) => {
  try {
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

    // Dividir el nombre del producto base en palabras individuales
    const palabrasNombreBase = productoBase.name.split(" ");

    // Construir la consulta para encontrar productos que contengan al menos una de las palabras del nombre base
    const productosSimilares = await Vista.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(productId) }, // Excluye el producto base
          price: { $gte: precioMin, $lte: precioMax }, // Filtra por rango de precio similar
          $or: palabrasNombreBase.map((palabra) => ({
            name: { $regex: palabra, $options: "i" }, // Búsqueda parcial insensible a mayúsculas/minúsculas
          })),
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
