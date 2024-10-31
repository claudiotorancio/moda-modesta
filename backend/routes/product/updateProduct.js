// Código del archivo updateProduct.js
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
      // Si oldImagePath es un solo string, conviértelo en un array
      const oldImages = Array.isArray(oldImagePath)
        ? oldImagePath
        : [oldImagePath];

      for (const path of oldImages) {
        // Verificar si la imagen está en el producto
        const imageIndex = updatedImagePath.indexOf(path);
        if (imageIndex !== -1) {
          // Reemplazar la imagen antigua con la nueva si se está subiendo una
          if (req.file) {
            updatedImagePath[imageIndex] = req.file.location; // Reemplazar la imagen en la posición correcta
          } else {
            // Si no se está subiendo una nueva imagen, solo eliminarla
            updatedImagePath.splice(imageIndex, 1);
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

    const sizesWithStock = [];

    // Verificar si sizes es una cadena JSON y parsearla
    let sizesParsed;

    try {
      sizesParsed = JSON.parse(sizes);
    } catch (error) {
      throw new Error("El formato de sizes no es válido. Debe ser un array.");
    }

    // Verificar si sizesParsed es un array y tiene elementos
    if (Array.isArray(sizesParsed) && sizesParsed.length > 0) {
      sizesParsed.forEach(({ size, stock }) => {
        if (size) {
          // Asumir que el stock ya es un número válido
          const parsedStock =
            stock !== undefined && stock !== null ? Number(stock) : 0;

          // Agregar el tamaño y stock al array sizesWithStock
          sizesWithStock.push({ size, stock: parsedStock });
        }
      });
    } else {
      // Si sizes no es un array, lanzar un error o manejarlo como consideres necesario
      throw new Error("El formato de sizes no es válido. Debe ser un array.");
    }

    // Datos a actualizar
    const updateData = {
      name,
      price,
      description,
      sizes: sizesWithStock.length > 0 ? sizesWithStock : [], // Si no hay talles, se guarda un array vacío
      isFeatured,
      imagePath: updatedImagePath.length ? updatedImagePath : undefined,
    };

    // Si no hay talles, incluir `generalStock`
    if (sizesWithStock.length === 0 && generalStock !== undefined) {
      updateData.generalStock = Number(generalStock) || 0; // Guardar generalStock si no hay talles
    }

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
  return "admin";
};

export default updateProduct;
