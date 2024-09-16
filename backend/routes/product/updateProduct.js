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

    // Agregar la nueva imagen al array imagePath si se proporciona
    if (req.file) {
      const newImagePath = req.file.location;
      updatedImagePath.push(newImagePath);
    }

    const sizesWithStock = [];
    if (Array.isArray(sizes)) {
      sizes.forEach((size) => {
        const normalizedSize = size.replace(" ", "_").toLowerCase();
        const stock = req.body[`stock_${normalizedSize}`];

        // Aquí aseguras que el valor 0 se tome como válido
        const parsedStock =
          stock !== undefined && stock !== null ? Number(stock) : 0;

        console.log(`Size: ${size}, Stock: ${parsedStock}`); // Debugging
        sizesWithStock.push({ size, stock: parsedStock });
      });
    } else {
      const normalizedSize = sizes.replace(" ", "_").toLowerCase();
      const stock = req.body[`stock_${normalizedSize}`];

      // Aseguramos que el valor 0 se tome como válido
      const parsedStock =
        stock !== undefined && stock !== null ? Number(stock) : 0;

      sizesWithStock.push({ size: sizes, stock: parsedStock });
    }

    console.log(sizesWithStock);

    // Datos a actualizar
    const updateData = {
      name,
      price,
      description,
      sizes: sizesWithStock,
      isFeatured,
      imagePath: updatedImagePath.length ? updatedImagePath : undefined,
    };

    // Actualizar el producto en la base de datos
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
