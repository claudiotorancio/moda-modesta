import Vista from "../../models/Vista.js";
import Order from "../../models/Order.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

export const compraCancelada = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    const orderId = req.params.id; // ID del pedido desde los parámetros de la URL
    const { productos } = req.body; // Productos desde el cuerpo de la solicitud

    // Actualizar el stock de los productos y tallas
    await Promise.all(
      productos.map(async (producto) => {
        const product = await Vista.findById(producto.productId); // Cambiado a productId

        if (product) {
          if (product.sizes && product.sizes.length > 0) {
            // Si el producto tiene talles, actualizar el stock del tamaño correspondiente
            const size = product.sizes.find((s) => s.size === producto.size);
            if (size) {
              size.stock += producto.quantity; // Devolver stock del tamaño
              size.stock = Math.max(size.stock, 0); // Evitar stock negativo
              await product.save();
            } else {
              console.warn(
                `Tamaño ${producto.size} no encontrado para el producto con ID ${producto.productId}.`
              );
            }
          } else {
            // Si el producto no tiene talles, devolver el stock general
            product.generalStock += producto.quantity; // Devolver stock general
            product.generalStock = Math.max(product.generalStock, 0); // Evitar stock negativo
            await product.save();
          }
        } else {
          console.warn(`Producto con ID ${producto.productId} no encontrado.`);
        }
      })
    );

    // Actualizar el estado del pedido a "cancelado"
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { cancelado: true },
      { new: true }
    );

    res.status(201).json({ message: "Compra cancelada.", updatedOrder });
  } catch (error) {
    console.error("Error al actualizar el stock:", error.message);
    res.status(500).send({ error: "Error al cancelar la compra." });
  }
};
