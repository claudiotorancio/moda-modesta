import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
});

const updateProduct = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    // Parametros del formulario
    const { id } = req.params;
    const { name, price, description, oldImagePath, sizes, isFeatured } =
      req.body;

    // Verificar si se proporciona una nueva imagen en el formulario de edición
    let imagePath = oldImagePath;
    if (req.file) {
      imagePath = req.file.location;
    }

    // Construir el objeto de actualización del producto
    const updateProduct = {
      name,
      price,
      description,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      isFeatured,
    };

    // Agregar la imagen al objeto de actualización solo si se proporciona una nueva imagen
    if (req.file) {
      updateProduct.imagePath = req.file.location;
    }

    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let result;
    if (req.isAuthenticated() && req.user.role === "admin") {
      result = await Vista.findByIdAndUpdate(id, updateProduct, { new: true });
    } else {
      result = await Product.findByIdAndUpdate(id, updateProduct, {
        new: true,
      });
    }

    // Borrar oldImage en S3 solo si se proporciona una nueva imagen
    if (req.file) {
      const nombreDeArchivo = oldImagePath.split("/").pop();
      const params = {
        Bucket: process.env.BUCKET_AWS,
        Key: nombreDeArchivo,
      };

      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("Error al eliminar la imagen en S3:", err);
        } else {
          console.log("Imagen anterior eliminada con éxito en S3:", data);
        }
      });
    }

    // Manejar el resultado de la actualización
    if (!result) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json({ message: "Product updated", updatedProduct: result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const esAdministrador = (user) => {
  // Implementa aquí la lógica para determinar si el usuario es administrador
  return user.role === "admin";
};

export default updateProduct;

/*import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import AWS from 'aws-sdk'

//codigo para conectar a base de datos s3 y actualizar la imagen en s3 
const s3 = new AWS.S3({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
})

const updateProduct = async (req, res) => {
    try {
        //parametros de formulario
        const { id } = req.params
        /*const { name, price} = req.body

        const { name, price, oldImagePath } = req.body
        const imagePath = req.file.location

        //convirtiendo info en objeto.
        /*const updateProduct = {
            name,
            price,
        }
        const updateProduct = {
            name,
            price,
            imagePath,
            oldImagePath
        }
        //conectar a base de datos mediante serverless function
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await Product.findByIdAndUpdate(id, updateProduct, { new: true })
        //borrar oldImage en s3
       const nombreDeArchivo = oldImagePath.split('/').pop();
        const params = {
            Bucket: process.env.BUCKET_AWS,
            Key: nombreDeArchivo,
        };

        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.error('Error al eliminar la imagen en S3:', err);
            } else {
                console.log('Imagen anterior eliminada con éxito en S3:', data);
            }
        });

        if (!result) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.json({ message: 'Product updated', updatedProduct: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

export default updateProduct*/
