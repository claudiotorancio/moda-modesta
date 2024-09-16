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
    const { name, price, description, oldImagePath, isFeatured, sizes } =
      req.body;

    // Conectar a la base de datos si no está ya conectada
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Obtener el producto actual
    const model = esAdministrador(req.user) ? Vista : Product;
    const product = await model.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar la imagen antigua si es necesario
    let updatedImagePath = product.imagePath || [];
    if (Array.isArray(oldImagePath)) {
      for (const path of oldImagePath) {
        updatedImagePath = updatedImagePath.filter((image) => image !== path);

        // Eliminar la imagen de S3
        const nombreDeArchivo = path.split("/").pop();
        const params = {
          Bucket: process.env.BUCKET_AWS,
          Key: nombreDeArchivo,
        };

        await s3.deleteObject(params).promise();
      }
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

      await s3.deleteObject(params).promise();
    }

    // Agregar la nueva imagen al array imagePath si se proporciona
    if (req.file) {
      const newImagePath = req.file.location;
      updatedImagePath.push(newImagePath);
    }

    // Actualizar los talles y el stock solo si se proporciona
    let updatedSizes = product.sizes;
    if (sizes) {
      const parsedSizes = JSON.parse(sizes); // Parsear el JSON de talles y stock
      updatedSizes = parsedSizes;
    }

    // Datos a actualizar
    const updateData = {
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(updatedSizes && { sizes: updatedSizes }),
      ...(updatedImagePath.length ? { imagePath: updatedImagePath } : {}),
    };

    // Actualizar el producto en la base de datos
    const updatedProduct = await model.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Producto actualizado exitosamente", updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default updateProduct;
