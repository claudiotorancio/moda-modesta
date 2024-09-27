import mongoose from "mongoose";
import Notification from "../../models/Notification.js";
import MONGODB_URI from "../../config.js";

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
        .send({ error: "El correo electrónico proporcionado no es válido." });
    }

    // Conectar a la base de datos si es necesario
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verificar si el usuario ya existe
    const existingNotification = await Notification.findOne({
      email,
      productId,
    });
    if (existingNotification) {
      return res.status(400).send({ error: "Este correo ya está registrado." });
    }

    // Crea una nueva notificación
    const notification = new Notification({ email, productId });

    await notification.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al guardar la notificacion", error.message);
    res.status(500).send({ error: "Error alguardar la notificacion." });
  }
};

export default notificacionSinStock;
