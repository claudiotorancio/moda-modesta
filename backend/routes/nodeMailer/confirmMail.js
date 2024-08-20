import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Users from '../../models/User.js';

const confirmMail = async (req, res) => {
  const { token } = req.query;

  console.log(token);

  if (!token) {
    return res.status(400).send({ success: false, message: 'Token no proporcionado' });
  }

  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos usando el _id decodificado
    const user = await Users.findById(decoded._id);

    if (!user) {
      return res.status(404).send({ success: false, message: 'Usuario no encontrado' });
    }

    // Verificar si el correo ya ha sido confirmado
    if (user.emailVerified) {
      return res.send({ success: true, message: 'El correo ya está confirmado' });
    }

    // Actualizar el estado del correo electrónico del usuario
    user.emailVerified = true;
    await user.save();

    res.send({ success: true, message: 'Correo confirmado exitosamente' });
  } catch (error) {
    console.error('Error al confirmar el correo:', error.message);
    res.status(400).send({ success: false, message: 'Token inválido o expirado' });
  }
};

export default confirmMail;
