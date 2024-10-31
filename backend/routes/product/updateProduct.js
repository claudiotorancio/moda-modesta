import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import AWS from "aws-sdk";
import { connectToDatabase } from "../../db/connectToDatabase.js";
import { uploadSingleUpdate } from "../../../api/router.js"; // Asegúrate de que esto sea una función

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

    console.log(req.body);

    await connectToDatabase();

    const model = esAdministrador(req.user) ? Vista : Product;
    const product = await model.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Mantener el array de imágenes actualizado
    let updatedImagePath = product.imagePath || [];

    // Eliminar imágenes antiguas si se proporcionan
    if (oldImagePath) {
      const oldImages = Array.isArray(oldImagePath)
        ? oldImagePath
        : [oldImagePath];

      for (const path of oldImages) {
        const imageIndex = updatedImagePath.indexOf(path);
        if (imageIndex !== -1) {
          if (req.file) {
            updatedImagePath[imageIndex] = req.file.location; // Reemplazar la imagen en la posición correcta
          } else {
            updatedImagePath.splice(imageIndex, 1); // Eliminar si no se sube una nueva imagen
          }

          // Eliminar la imagen de S3 si ha sido eliminada
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

    // Verificar si se proporciona generalStock
    if (generalStock !== undefined) {
      // Asegúrate de que sea un número
      const parsedGeneralStock = Number(generalStock);
      if (isNaN(parsedGeneralStock)) {
        return res
          .status(400)
          .json({ error: "El generalStock debe ser un número." });
      }

      // Datos a actualizar
      const updateData = {
        name,
        price,
        description,
        generalStock: parsedGeneralStock || 0, // Guardar generalStock
        isFeatured,
        imagePath: updatedImagePath.length ? updatedImagePath : undefined,
      };

      // Actualizar el producto en la base de datos
      const result = await model.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!result) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.json({
        message: "Producto actualizado",
        updatedProduct: result,
      });
    }

    // Si sizes no se proporciona, simplemente retornamos un error
    if (!sizes || sizes.length === 0) {
      return res
        .status(400)
        .json({ error: "Se debe proporcionar sizes o generalStock." });
    }

    // Lógica para manejar sizes si se proporciona
    const sizesWithStock = [];
    let sizesParsed;

    try {
      sizesParsed = JSON.parse(sizes);
    } catch (error) {
      return res.status(400).json({
        error: "El formato de sizes no es válido. Debe ser un array.",
      });
    }

    // Verificar si sizesParsed es un array y tiene elementos
    if (Array.isArray(sizesParsed) && sizesParsed.length > 0) {
      sizesParsed.forEach(({ size, stock }) => {
        if (size) {
          const parsedStock = Number(stock) || 0; // Asumir que el stock ya es un número válido
          sizesWithStock.push({ size, stock: parsedStock });
        }
      });
    } else {
      return res.status(400).json({
        error: "El formato de sizes no es válido. Debe ser un array.",
      });
    }

    // Datos a actualizar
    const updateData = {
      name,
      price,
      description,
      sizes: sizesWithStock.length > 0 ? sizesWithStock : [], // Solo se incluye sizes si hay datos
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
    res.status(500).json({ error: "Producto no actualizado" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default updateProduct;
