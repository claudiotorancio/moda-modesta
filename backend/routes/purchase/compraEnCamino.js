import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Order from "../../models/Order.js";

const compraEnCamino = async (req, res) => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener el ID del producto desde los parámetros de la solicitud
    const productId = req.params.id;

    // Actualizar el estado del pedido (ejemplo: cambiar 'checked' a true para indicar que el pedido ha sido aceptado)
    const updatedProduct = await Order.findByIdAndUpdate(
      productId,
      { enCamino: true }, // Aquí actualizamos el campo 'enCamino' a true
      { new: true } // Opción para devolver el documento actualizado
    );
    console.log(updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con la información actualizada del pedido
    res.json({
      message: "Pedido en camino actualizado",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
};

export default compraEnCamino;
