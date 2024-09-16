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
    const { name, price, description, isFeatured, sizes } = req.body; // `sizes` es un JSON enviado desde el cliente

    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Obtener el producto actual
    const model = esAdministrador(req.user) ? Vista : Product;
    const product = await model.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar los datos del producto
    product.name = name;
    product.price = price;
    product.description = description;
    product.isFeatured = isFeatured;

    // Actualizar las imágenes (si es necesario) y eliminar las anteriores
    // Eliminar la imagen antigua si es necesario
    let updatedImagePath = product.imagePath || [];
    if (Array.isArray(oldImagePath)) {
      oldImagePath.forEach((path) => {
        updatedImagePath = updatedImagePath.filter((image) => image !== path);

        // Eliminar la imagen de S3
        const nombreDeArchivo = path.split("/").pop();
        const params = {
          Bucket: process.env.BUCKET_AWS,
          Key: nombreDeArchivo,
        };

        s3.deleteObject(params, (err, data) => {
          if (err) {
            console.error("Error al eliminar la imagen en S3:", err);
          } else {
            console.log("Imagen eliminada con éxito en S3:", data);
          }
        });
      });
    } else if (oldImagePath) {
      updatedImagePath = updatedImagePath.filter(
        (image) => image !== oldImagePath
      );

      // Eliminar la imagen de S3
      const nombreDeArchivo = oldImagePath.split("/").pop();
      const params = {
        Bucket: process.env.BUCKET_AWS,
        Key: nombreDeArchivo,
      };

      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("Error al eliminar la imagen en S3:", err);
        } else {
          console.log("Imagen eliminada con éxito en S3:", data);
        }
      });
    }

    // Actualizar los talles y el stock
    if (sizes) {
      const parsedSizes = JSON.parse(sizes); // Parsear el JSON de talles y stock
      product.sizes = parsedSizes; // Asignar los nuevos talles y stock
    }

    // Guardar los cambios en la base de datos
    await product.save();

    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default updateProduct;
