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
    const { id } = req.params;
    const {
      name,
      price,
      description,
      oldImagePath,
      sizes,
      generalStock,
      isFeatured,
    } = req.body;

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

      oldImages.forEach(async (path) => {
        // Verificar si la imagen está en el producto
        if (updatedImagePath.includes(path)) {
          updatedImagePath = updatedImagePath.filter((image) => image !== path);

          // Eliminar la imagen de S3
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
      });
    }

    // Agregar la nueva imagen al array imagePath si se proporciona
    if (req.file) {
      const newImagePath = req.file.location;
      updatedImagePath.push(newImagePath);
    }

    const sizesWithStock = [];

    // Verificar si sizes es un array o un valor válido
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizes.forEach((size) => {
        if (size) {
          const normalizedSize = size.replace(" ", "_").toLowerCase();
          const stock = req.body[`stock_${normalizedSize}`];

          // Verificar si el stock es un número válido (0 es válido)
          const parsedStock =
            stock !== undefined && stock !== null ? Number(stock) : 0;

          sizesWithStock.push({ size, stock: parsedStock });
        }
      });
    } else if (sizes) {
      // Si sizes es un valor único, procesarlo individualmente
      const normalizedSize = sizes.replace(" ", "_").toLowerCase();
      const stock = req.body[`stock_${normalizedSize}`];

      const parsedStock =
        stock !== undefined && stock !== null ? Number(stock) : 0;

      sizesWithStock.push({ size: sizes, stock: parsedStock });
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
  return user.role === "admin";
};

export default updateProduct;
