import CustomerAnalytic from "../../models/CustomerAnalytics.js";
import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getCustomerAnalytics = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener los datos de análisis del cliente y solo procesar aquellos con un customerId válido
    const analytics = await CustomerAnalytic.find().populate("customerId");

    // Filtrar solo los análisis que tienen un customerId válido
    const validAnalytics = analytics.filter(
      (analytic) => analytic.customerId !== null
    );

    // Si no hay análisis válidos, devolver un mensaje
    if (!validAnalytics.length) {
      return res.status(404).json({
        message: "No se encontraron datos de análisis de clientes válidos.",
      });
    }

    // Log para depuración
    validAnalytics.forEach((analytic) => {
      console.log("Customer Name:", analytic.customerId.nombre);
    });

    // Obtener las compras confirmadas y calcular estadísticas
    const cliente_data = await Promise.all(
      validAnalytics.map(async (analytic) => {
        const comprasConfirmadas = await Sale.find({
          customerId: analytic.customerId._id,
          compraConfirmada: true, // Filtra solo las compras confirmadas
        });

        // Solo procesar si hay compras confirmadas
        if (comprasConfirmadas.length > 0) {
          const totalGastadoConfirmado = comprasConfirmadas.reduce(
            (acc, compra) => acc + compra.totalPrice,
            0
          );
          const frecuenciaConfirmada = comprasConfirmadas.length;
          const valorPromedioConfirmado =
            frecuenciaConfirmada > 0
              ? totalGastadoConfirmado / frecuenciaConfirmada
              : 0;

          return {
            nombre: analytic.customerId.nombre,
            total_compras: totalGastadoConfirmado,
            frecuencia: frecuenciaConfirmada,
            valor_promedio: valorPromedioConfirmado,
          };
        }
        return null; // Retornar null si no hay compras confirmadas
      })
    );

    // Filtrar los resultados para eliminar los null
    const validClienteData = cliente_data.filter((cliente) => cliente !== null);

    // Si no hay datos válidos, devolver un mensaje
    if (validClienteData.length === 0) {
      return res.status(404).json({
        message: "No se encontraron clientes con compras confirmadas.",
      });
    }

    // Calcular estadísticas adicionales para el reporte general
    const totalVentas = validClienteData.reduce(
      (sum, cliente) => sum + cliente.total_compras,
      0
    );
    const totalClientes = validClienteData.length;
    const recurrentes = validClienteData.filter(
      (cliente) => cliente.frecuencia > 1
    ).length;

    const porcentaje_recurrentes = (recurrentes / totalClientes) * 100 || 0;
    const promedio_por_cliente = totalClientes
      ? totalVentas / totalClientes
      : 0;

    // Estructurar la respuesta
    const responseData = {
      cliente_data: validClienteData,
      porcentaje_recurrentes: porcentaje_recurrentes.toFixed(2),
      promedio_por_cliente: promedio_por_cliente.toFixed(2),
      total_ventas: totalVentas.toFixed(2),
    };

    // Devolver la respuesta
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error al obtener los datos de análisis del cliente:", error);
    res.status(500).json({
      error: "Error al obtener los datos de análisis del cliente.",
    });
  }
};

export default getCustomerAnalytics;
