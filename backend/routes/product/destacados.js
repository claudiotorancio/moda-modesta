import Vista from "../../models/Vista.js";
import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const destacadosProduct = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener productos destacados
    const productosDestacados = await Vista.find({
      isFeatured: true,
      isActive: true,
      section: { $in: ["opcion1", "opcion2", "opcion3"] },
      $or: [
        { generalStock: { $gt: 0 } }, // Productos con generalStock mayor a 0
        { "sizes.stock": { $gt: 0 } }, // O productos con al menos un tamaño con stock mayor a 0
      ],
    })
      .sort({ discount: -1 })
      .limit(20);

    // Obtener los productos más vendidos
    const topSelling = await Sale.aggregate([
      {
        $match: { compraConfirmada: true }, // Filtrar solo ventas confirmadas
      },
      {
        $group: {
          _id: "$productId", // Agrupar por productId
          totalSales: { $sum: "$quantity" }, // Sumar las cantidades vendidas
        },
      },
      {
        $lookup: {
          from: "vistas",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo", // Desenrollar para acceder a los campos de producto
      },
      {
        $addFields: {
          revenueGenerated: {
            $multiply: ["$totalSales", "$productInfo.price"],
          }, // Calcular ingresos generados
        },
      },
      {
        $sort: { totalSales: -1 }, // Ordenar por total de ventas descendente
      },
      {
        $limit: 10, // Limitar a los 10 productos más vendidos
      },
    ]);

    // Extraer solo los detalles de los productos más vendidos
    const productosMasVendidos = topSelling.map(
      (product) => product.productInfo
    );

    // Crear un conjunto de _id únicos para evitar duplicados
    const productosCombinados = [
      ...productosDestacados,
      ...productosMasVendidos,
    ];

    // Eliminar productos duplicados utilizando un Set basado en el _id del producto
    const productosUnicos = productosCombinados.filter(
      (producto, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === producto._id.toString())
    );

    // Enviar los productos combinados y sin duplicados como respuesta
    res.json(productosUnicos);
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener productos destacados", error });
  }
};

export default destacadosProduct;
