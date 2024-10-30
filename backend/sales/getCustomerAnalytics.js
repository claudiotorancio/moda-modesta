import CustomerAnalytic from "../models/CustomerAnalytics.js";
import Sale from "../models/Sales.js";
import { connectToDatabase } from "../db/connectToDatabase.js";

const getCustomerAnalytics = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener los datos de análisis del cliente con el customerId populado
    const analytics = await CustomerAnalytic.find().populate("customerId");

    // Verificar si hay datos de análisis
    if (!analytics.length) {
      return res.status(404).json({
        message: "No se encontraron datos de análisis de clientes.",
      });
    }

    // Procesar cada análisis para obtener datos de compra confirmada
    const cliente_data = await Promise.all(
      analytics.map(async (analytic) => {
        // Verificar si customerId es válido
        if (!analytic.customerId || !analytic.customerId._id) return null;

        // Obtener compras confirmadas para este cliente
        const comprasConfirmadas = await Sale.find({
          customerId: analytic.customerId._id,
          compraConfirmada: true,
        });

        // Si no hay compras confirmadas, retorna null
        if (!comprasConfirmadas.length) return null;

        // Calcular datos agregados
        const totalGastadoConfirmado = comprasConfirmadas.reduce(
          (acc, compra) => acc + compra.totalPrice,
          0
        );
        const frecuenciaConfirmada = comprasConfirmadas.length;
        const valorPromedioConfirmado =
          frecuenciaConfirmada > 0
            ? (totalGastadoConfirmado / frecuenciaConfirmada).toFixed(2)
            : 0;

        return {
          nombre: analytic.customerId.nombre || "Cliente Desconocido",
          total_compras: totalGastadoConfirmado.toFixed(2),
          frecuencia: frecuenciaConfirmada,
          valor_promedio: valorPromedioConfirmado,
        };
      })
    );

    // Filtrar los datos válidos
    const validClienteData = cliente_data.filter(Boolean);

    // Si no hay clientes con compras confirmadas, responder con mensaje
    if (!validClienteData.length) {
      return res.status(404).json({
        message: "No se encontraron clientes con compras confirmadas.",
      });
    }

    // Cálculos generales
    const totalVentas = validClienteData.reduce(
      (sum, cliente) => sum + parseFloat(cliente.total_compras),
      0
    );
    const totalClientes = validClienteData.length;
    const recurrentes = validClienteData.filter(
      (cliente) => cliente.frecuencia > 1
    ).length;
    const porcentaje_recurrentes = totalClientes
      ? ((recurrentes / totalClientes) * 100).toFixed(2)
      : 0;
    const promedio_por_cliente = totalClientes
      ? (totalVentas / totalClientes).toFixed(2)
      : 0;

    // Responder con los datos estructurados
    const responseData = {
      cliente_data: validClienteData,
      porcentaje_recurrentes,
      promedio_por_cliente,
      total_ventas: totalVentas.toFixed(2),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error al obtener los datos de análisis del cliente:", error);
    res.status(500).json({
      error: "Error al obtener los datos de análisis del cliente.",
    });
  }
};

export default getCustomerAnalytics;
