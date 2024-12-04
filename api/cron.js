import moment from "moment-timezone";
import Vista from "../backend/models/Vista.js";
import { connectToDatabase } from "../backend/db/connectToDatabase.js";
import nodemailer from "nodemailer";

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.ACCESS_KEY_ID,
    },
    tls: { rejectUnauthorized: false },
  });
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToDatabase();
    try {
      const currentDate = moment.utc(new Date()).startOf("day");
      console.log(currentDate);

      // Buscar y actualizar productos en lote
      const result = await Vista.updateMany(
        { discountExpiry: { $lte: currentDate } },
        { $set: { discount: 0, discountExpiry: "" } }
      );

      console.log(`${result.modifiedCount} productos actualizados`);

      // Configurar envío de correo
      const transporter = createTransporter();
      const emailContent = `
        <p>Estimado administrador,</p>
        <p>Se han actualizado ${
          result.modifiedCount
        } productos cuyos descuentos han expirado.</p>
        <p>Fecha de la actualización: ${moment
          .utc(new Date())
          .format("YYYY-MM-DD HH:mm:ss")}</p>
      `;

      const mailOptions = {
        from: process.env.EMAIL,
        to: "claudiotorancio@gmail.com", // Cambiar por el correo destinatario
        subject: "Actualización de productos con descuentos expirados",
        html: emailContent,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log("Correo enviado exitosamente");

      res.status(200).json({
        message: "Productos actualizados y correo enviado exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar productos:", error);

      // Intentar enviar un correo en caso de error
      try {
        const transporter = createTransporter();
        const errorEmailContent = `
          <p>Estimado administrador,</p>
          <p>Ha ocurrido un error al ejecutar la tarea programada:</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p>Fecha: ${moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")}</p>
        `;

        const errorMailOptions = {
          from: process.env.EMAIL,
          to: "claudiotorancio@gmail.com", // Cambiar por el correo destinatario
          subject: "Error en la tarea programada de actualización",
          html: errorEmailContent,
        };

        await transporter.sendMail(errorMailOptions);
        console.log("Correo de error enviado exitosamente");
      } catch (emailError) {
        console.error(
          "Error al enviar correo de notificación de error:",
          emailError
        );
      }

      res.status(500).send("Error al ejecutar cron job");
    }
  } else {
    res.status(405).send("Método no permitido");
  }
}
