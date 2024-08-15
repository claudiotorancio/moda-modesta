import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import AWS from 'aws-sdk'
import Vista from "../../models/Vista.js";

//conectar con base de datos s3 para eliminar imagen

const s3 = new AWS.S3({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
});

const deleteProduct = async (req, res) => {
  let eliminarProduct; // Declaración de la variable eliminarProduct

  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    //conectar a base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const productId = req.params.id;

    // Determinar qué modelo de producto utilizar según el rol del usuario
    if (esAdministrador(req.user)) {
      eliminarProduct = await Vista.findByIdAndDelete(productId);
    } else {
      eliminarProduct = await Product.findByIdAndDelete(productId);
    }

    const nombreDeArchivo = eliminarProduct.imagePath.split('/').pop();

    const params = {
      Bucket: process.env.BUCKET_AWS,
      Key: nombreDeArchivo,
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error('Error al eliminar la imagen en S3:', err);
      } else {
        console.log('Imagen eliminada con éxito en S3:', data);
      }
    });

    res.json({ message: 'Product deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const esAdministrador = (user) => {
  // Implementa aquí la lógica para determinar si el usuario es administrador
  return user.role === "admin";
};

export default deleteProduct;
