import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getSalesByPeriod = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener filtros del request
    const { period, category, startDate, endDate } = req.query;
    console.log(req.query);

    // Inicializar fechas para la consulta
    let start, end;

    if (startDate && endDate) {
      // Si se proporcionan ambas fechas, las usamos directamente
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      // Configura 'end' al final de endDate
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      end = new Date(); // Esta es la fecha actual

      // Ajuste de las fechas si se especifica un periodo
      switch (period) {
        case "daily":
          // Establecer la fecha de inicio al comienzo del día (medianoche)
          start = new Date(end);
          start.setHours(0, 0, 0, 0);

          // Establecer la fecha de fin al final del día (23:59:59)
          end.setHours(23, 59, 59, 999);
          break;
        case "weekly":
          start = new Date(end);
          start.setDate(start.getDate() - 7);
          break;
        case "monthly":
          start = new Date(end);
          start.setMonth(end.getMonth() - 1);
          break;
        case "annual":
          start = new Date(end);
          start.setFullYear(end.getFullYear() - 1);
          break;
        default:
          return res.status(400).json({ error: "Período inválido" });
      }
    }

    // Asegurarse de que las fechas sean válidas
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }

    // Construir la consulta
    const query = {
      date: {
        $gte: start,
        $lte: end,
      },
      compraConfirmada: true, // Filtrar solo las ventas confirmadas
    };

    if (category) {
      query.category = category; // Filtrar por categoría si se proporciona
    }

    // Buscar las ventas en la base de datos
    const sales = await Sale.find(query).exec();

    // Enviar la respuesta al cliente
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
};

export default getSalesByPeriod;
