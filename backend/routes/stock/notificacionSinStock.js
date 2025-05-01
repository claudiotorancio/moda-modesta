import Notification from "../../models/Notification.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const notificacionSinStock = async (req, res) => {
  try {
    const { email, id } = req.body;
    const productId = id;

    // Verificar que todos los campos requeridos están presentes
    if (!email || !productId) {
      return res
        .status(400)
        .send({ error: "Todos los campos son requeridos." });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "El correo electrónico proporcionado no es válido." });
    }

    // Conectar a la base de datos si es necesario
    await connectToDatabase();

    // Verificar si el usuario ya existe
    const existingNotification = await Notification.findOne({
      email,
      productId,
      notified: false,
    });
    if (existingNotification) {
      return res.status(400).json({
        error:
          "Este correo junto con este producto ya se encuentran registrados para su notificacion.",
      });
    }

    // Crea una nueva notificación
    const notification = new Notification({ email, productId });

    await notification.save();

    res.status(201).json({
      success: true,
      message:
        "Notificacion guardada! te avisaremos cuando tengamos ingeso del producto..",
    });
  } catch (error) {
    console.error("Error al guardar la notificacion", error.message);
    res.status(500).json({
      error: "Error al guardar la notificacion, intente nuevamente mas tarde",
    });
  }
};

export default notificacionSinStock;
