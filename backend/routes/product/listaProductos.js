import Vista from "../../models/Vista.js";
import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

// Controlador para listar productos
const listaProductos = async (req, res) => {
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

    // Buscar productos activos o de admin, según el contexto
    const products = await Vista.find(query)
      .sort({
        generalStock: -1, // Productos con generalStock mayor a 0 primero
        "sizes.stock": -1, // Si generalStock es 0, ordenar por stock en talles
        discount: -1, // Priorizar productos con descuentos
      })
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

    // Combinar productos listados con productos más vendidos
    const productosCombinados = [...products, ...productosMasVendidos];

    // Eliminar productos duplicados utilizando un Set basado en el _id del producto
    const productosUnicos = productosCombinados.filter(
      (producto, index, self) =>
        index ===
        self.findIndex((p) => p._id.toString() === producto._id.toString())
    );

    // Ordenar los productos combinados: primero las ofertas, luego los más vendidos
    const productosOrdenados = productosUnicos.sort((a, b) => {
      // Primero los productos con descuento (por ejemplo, descuento mayor a 0)
      if (b.discount > 0 && a.discount === 0) return 1; // b tiene descuento, a no
      if (a.discount > 0 && b.discount === 0) return -1; // a tiene descuento, b no
      return 0; // Si ambos tienen o no tienen descuento, no hay cambio en el orden
    });

    // Enviar los productos ordenados y sin duplicados como respuesta
    res.json(productosOrdenados);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductos;
