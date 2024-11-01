import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import AWS from "aws-sdk";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const s3 = new AWS.S3({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
});

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      oldImagePath,
      sizes,
      generalStock,
      isFeatured,
      id,
    } = req.body;

    await connectToDatabase();

    const model = esAdministrador(req.user) ? Vista : Product;
    const product = await model.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Prepara los datos de actualización
    const updateData = {
      name,
      price,
      description,
      isFeatured,
    };

    if (generalStock !== undefined) {
      const parsedGeneralStock = Number(generalStock);
      if (isNaN(parsedGeneralStock)) {
        return res
          .status(400)
          .json({ error: "El generalStock debe ser un número." });
      }
      updateData.generalStock = parsedGeneralStock;
    }

    if (sizes) {
      try {
        const sizesParsed = JSON.parse(sizes);
        if (Array.isArray(sizesParsed) && sizesParsed.length > 0) {
          updateData.sizes = sizesParsed.map(({ size, stock }) => ({
            size,
            stock: Number(stock) || 0,
          }));
        }
      } catch (error) {
        return res.status(400).json({
          error: "El formato de sizes no es válido. Debe ser un array.",
        });
      }
    }

    // Actualizar el producto en la base de datos sin incluir aún las imágenes
    const result = await model.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Si el producto se actualizó, actualizamos las imágenes
    let updatedImagePath = product.imagePath || [];

    if (oldImagePath) {
      const oldImages = Array.isArray(oldImagePath)
        ? oldImagePath
        : [oldImagePath];
      for (const path of oldImages) {
        const imageIndex = updatedImagePath.indexOf(path);
        if (imageIndex !== -1) {
          if (req.file) {
            updatedImagePath[imageIndex] = req.file.location; // Reemplaza la imagen en la posición correcta
          } else {
            updatedImagePath.splice(imageIndex, 1); // Elimina la imagen si no hay una nueva
          }

          // Elimina la imagen de S3
          const nombreDeArchivo = path.split("/").pop();
          const params = {
            Bucket: process.env.BUCKET_AWS,
            Key: nombreDeArchivo,
          };
          try {
            await s3.deleteObject(params).promise();
            console.log("Imagen eliminada con éxito en S3:", nombreDeArchivo);
          } catch (err) {
            console.error("Error al eliminar la imagen en S3:", err);
          }
        }
      }
    }

    // Asigna las nuevas rutas de imagen y guarda los cambios
    result.imagePath = updatedImagePath.length ? updatedImagePath : undefined;
    await result.save();

    res.json({ message: "Producto actualizado", updatedProduct: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Producto no actualizado" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default updateProduct;
