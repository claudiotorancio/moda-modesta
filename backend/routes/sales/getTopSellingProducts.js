import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getTopSellingProducts = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener la categoría de la consulta
    const { category } = req.query;

    // Realizar la agregación para acumular las ventas por producto
    const topSelling = await Sale.aggregate([
      {
        $match: { compraConfirmada: true }, // Filtrar solo ventas confirmadas
      },
      {
        $group: {
          _id: "$productId", // Agrupar por productId
          totalSales: { $sum: "$quantity" }, // Sumar las cantidades vendidas
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }, // Calcular los ingresos totales generados por el producto
          productName: { $first: "$name" }, // Obtener el nombre del producto
          productPrice: { $first: "$price" }, // Obtener el precio del producto
          productSize: { $first: "$size" }, // Obtener el tamaño del producto
          productHash: { $first: "$hash" }, // Obtener el hash del producto
          productCategory: { $first: "$category" }, // Obtener la categoría del producto
        },
      },
      {
        $sort: { totalSales: -1 }, // Ordenar por total de ventas descendente
      },
      {
        $limit: 10, // Limitar a los 10 productos más vendidos
      },
    ]);

    // Filtrar por categoría si se proporciona
    const filteredTopSelling = category
      ? topSelling.filter((product) => product.productCategory === category)
      : topSelling;

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
