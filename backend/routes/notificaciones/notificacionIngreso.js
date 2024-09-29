import nodemailer from "nodemailer";
import Notification from "../../models/Notification.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

// Función para manejar el ingreso de notificaciones y el envío de correos electrónicos
const notificacionIngreso = async (req, res) => {
  try {
    // Extraer los IDs de notificaciones y el ID del producto desde el cuerpo de la solicitud
    const { idProducto, idNotificaciones } = req.body;

    if (!idProducto || !idNotificaciones) {
      return res.status(400).json({
        error: "Se requieren los campos 'idProducto' y 'idNotificaciones'.",
      });
    }

    // Convertir la cadena de IDs de notificaciones en un array
    const idNotifieds = idNotificaciones.split(",");

    if (idNotifieds.length === 0) {
      return res.status(400).json({ error: "Lista de notificaciones vacía." });
    }

    // Conectar a MongoDB si no se ha hecho previamente
    await connectToDatabase();

    // Buscar notificaciones no notificadas por sus IDs
    const notifications = await Notification.find({
      _id: { $in: idNotifieds },
      notified: false, // Solo notificaciones que no han sido enviadas
    });

    if (notifications.length === 0) {
      return res.status(404).json({
        error: "No se encontraron notificaciones pendientes de enviar.",
      });
    }

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para puerto 465
      auth: {
        user: process.env.EMAIL, // Correo del remitente
        pass: process.env.ACCESS_KEY_ID, // Contraseña o token de acceso
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Contenido del correo electrónico
    const emailContent = `
     <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #0056b3;">¡Buenas noticias!</h1>
    <p>Estimado cliente,</p>
    <p>
      Estamos encantados de informarte que el producto en el que estás interesado
      ya está disponible en nuestro stock. No pierdas la oportunidad de adquirirlo
      antes de que se agote nuevamente.
    </p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px;">
          <h2 style="color: #333;">Producto disponible</h2>
          <p>El artículo que esperabas ya está disponible. Haz clic en el botón de abajo para ver más detalles y realizar tu compra.</p>
          <a href="https://moda-modesta.vercel.app/#product-${idProducto}" 
             style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
            Ver Producto
          </a>
        </td>
      </tr>
    </table>
    <p>
      Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nuestro
      equipo de atención al cliente.
    </p>
    <p>Gracias por confiar en nosotros,</p>
    <p>El equipo de Moda Modesta</p>
  </div>
    `;

    // Enviar correos electrónicos y actualizar el estado de notificación en paralelo
    const emailPromises = notifications.map((notification) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: notification.email, // Correo electrónico del destinatario
        subject: "Notificación de Stock Disponible",
        html: emailContent,
      };

      // Enviar correo y actualizar la notificación
      return transporter.sendMail(mailOptions).then(() => {
        return Notification.updateOne(
          { _id: notification._id },
          { notified: true }
        );
      });
    });

    // Esperar a que todos los correos se envíen y las notificaciones se actualicen
    await Promise.all(emailPromises);

    console.log(
      "Correos enviados y notificaciones actualizadas correctamente."
    );

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: "Correos enviados y notificaciones actualizadas correctamente.",
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    return res.status(500).json({
      error:
        "Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente.",
    });
  }
};

export default notificacionIngreso;
