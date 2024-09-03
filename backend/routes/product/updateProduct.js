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

    const { id } = req.params;
    const { name, price, description, oldImagePath, sizes, isFeatured } =
      req.body;

    // Inicializar imagePath como array si es necesario
    let imagePath = Array.isArray(oldImagePath) ? oldImagePath : [oldImagePath];

    // Reemplazar imagen si se proporciona una nueva imagen
    if (req.file) {
      // Eliminar imagen antigua si existe
      if (oldImagePath) {
        oldImagePath.forEach(async (path) => {
          const nombreDeArchivo = path.split("/").pop();
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
        });
      }

      // Agregar la nueva imagen a imagePath
      imagePath = req.files ? req.files.map((file) => file.location) : [];
    }

    const updateData = {
      name,
      price,
      description,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      isFeatured,
      imagePath: imagePath.length ? imagePath : undefined,
    };

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const model = esAdministrador(req.user) ? Vista : Product;
    const result = await model.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", updatedProduct: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default updateProduct;
t;

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
