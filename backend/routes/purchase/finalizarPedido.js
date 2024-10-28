import Order from "../../models/Order.js";
import Sale from "../../models/Sales.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const finalizarPedido = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener el ID del producto desde los parámetros de la solicitud
    const productId = req.params.id;

    // Actualizar el estado del pedido en la colección Order
    const updatedProduct = await Order.findByIdAndUpdate(
      productId,
      { finalizado: true },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar el campo compraConfirmada en los registros de ventas relacionados
    await Sale.updateMany(
      { _id: productId }, // Filtra solo las ventas relacionadas con este producto
      { $set: { compraConfirmada: true } } // Actualiza el estado de compraConfirmada
    );

    // Responder con la información actualizada del pedido
    res.json({
      message: "Pedido finalizado y ventas confirmadas",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
    res.status(500).json({ message: "Error al finalizar el pedido" });
  }
};

export default finalizarPedido;
