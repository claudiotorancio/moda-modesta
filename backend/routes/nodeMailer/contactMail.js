import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Users from '../../models/User.js';
import { baseURL } from '../../../frontend/services/product_services.js';

const suscribeMail = async (req, res) => {
  try {
    const { email, nombre } = req.body;
    console.log(req.body);

    // Verificar que todos los campos requeridos están presentes
    if (!nombre || !email) {
      return res.status(400).send({ error: 'Todos los campos son requeridos.' });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ error: 'El correo electrónico proporcionado no es válido.' });
    }

    // Conectar a la base de datos si es necesario
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verificar si el usuario ya existe
    const existingUser = await Users.findOne({ username: email });
    if (existingUser) {
      return res.status(400).send({ error: 'Este correo ya está registrado.' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = new Users({
      username: email,
      password: 'Temporal', // Asegúrate de reemplazar esto con un proceso seguro para la creación de contraseñas
    });

    await newUser.save();

    // Generar un token de confirmación con el _id del nuevo usuario
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Construir la URL de confirmación
    const confirmUrl = `${baseURL}/api/confirmMail?token=${token}`;

    // Construir el contenido del correo
    const contentHTML = `
      <h3>Datos de Contacto</h3>
      <ul>
        <li>Correo: ${email}</li>
        <li>Nombre: ${nombre}</li>
      </ul>
      <p>¡Suscríbete para no perderte las novedades y recibir descuentos exclusivos!</p>
      <p>Para confirmar tu suscripción, por favor haz clic en el siguiente enlace:</p>
      <a href="${confirmUrl}">Confirmar Suscripción</a>
      <p>Recibirás un correo para validar tu email.</p>
    `;

    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL, // dirección de correo
        pass: process.env.ACCESS_KEY_ID, // contraseña o token de acceso
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    // Configurar el mensaje a enviar
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `¡Hola ${nombre}! Confirma tu suscripción`,
      html: contentHTML,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado:', info.messageId);
    res.status(201).send({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    res.status(500).send({ error: 'Error al enviar el correo.' });
  }
};

export default suscribeMail;
