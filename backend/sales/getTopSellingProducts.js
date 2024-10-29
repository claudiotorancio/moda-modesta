import Sale from "../models/Sales.js";
import { connectToDatabase } from "../db/connectToDatabase.js";

const getTopSellingProducts = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener la categoría de la consulta
    const { category } = req.query;
    // console.log("Query Params:", req.query);

    // Realizar la agregación para acumular las ventas por producto
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

    // console.log("Top Selling Products:", topSelling);

    // Filtrar por categoría si se proporciona
    const filteredTopSelling = category
      ? topSelling.filter((product) => product.productInfo.section === category)
      : topSelling;

    // if (filteredTopSelling.length === 0) {
    //   console.log(`No hay productos para la categoría: ${category}`);
    // }
    // // Iterar sobre los productos más vendidos y actualizar o crear registros
    // for (const product of filteredTopSelling) {
    //   const { _id: productId, totalSales } = product;

    //   const existing = await TopSellingProduct.findOne({ productId });

    //   if (existing) {
    //     existing.totalSales += totalSales;
    //     await existing.save();
    //   } else {
    //     const newTopSelling = new TopSellingProduct({
    //       productId,
    //       totalSales,
    //       period: "monthly", // O el período que prefieras
    //     });
    //     await newTopSelling.save();
    //   }
    // }

    // console.log("topStellings:", filteredTopSelling);

    // Enviar la respuesta al cliente

    res.status(200).json(filteredTopSelling);
  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos más vendidos" });
  }
};

export default getTopSellingProducts;
