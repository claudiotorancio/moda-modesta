import CustomerAnalytic from "../models/CustomerAnalytics.js";
import { connectToDatabase } from "../db/connectToDatabase.js";

const getCustomerAnalytics = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener los datos de análisis del cliente
    const analytics = await CustomerAnalytic.find().populate("customerId"); // Populando el campo customerId para obtener información del cliente

    if (!analytics.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron datos de análisis de clientes." });
    }

    // Formatear los datos para la respuesta
    const cliente_data = analytics.map((analytic) => ({
      nombre: analytic.customerId
        ? analytic.customerId.nombre
        : "Cliente Desconocido", // Asegúrate de tener el campo nombre en el modelo Customer
      total_compras: analytic.totalSpent,
      frecuencia: analytic.totalOrders, // Se asume que la frecuencia es igual al número total de pedidos
      valor_promedio: analytic.averageOrderValue, // Puedes usar el campo virtual si lo necesitas
    }));

    // Calcular estadísticas adicionales
    const totalVentas = analytics.reduce(
      (sum, analytic) => sum + analytic.totalSpent,
      0
    );
    const totalClientes = analytics.length;
    const recurrentes = analytics.filter(
      (analytic) => analytic.totalOrders > 1
    ).length; // Clientes recurrentes son aquellos con más de un pedido

    const porcentaje_recurrentes = (recurrentes / totalClientes) * 100 || 0; // Evitar división por cero
    const promedio_por_cliente = totalClientes
      ? totalVentas / totalClientes
      : 0;

    // Estructurar la respuesta
    const responseData = {
      cliente_data,
      porcentaje_recurrentes: porcentaje_recurrentes.toFixed(2),
      promedio_por_cliente: promedio_por_cliente.toFixed(2),
      total_ventas: totalVentas.toFixed(2),
    };

    // Devolver la respuesta
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error al obtener los datos de análisis del cliente:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los datos de análisis del cliente." });
  }
};

export default getCustomerAnalytics;
