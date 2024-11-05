import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      section,
      isFeatured,
      generalStock,
      discount,
    } = req.body;

    let sizes = [];
    if (section !== "opcion3") {
      sizes = JSON.parse(req.body.sizes || "[]");
    }

    // Validar que el descuento sea un número entre 0 y 100
    const validDiscount = parseFloat(discount);
    if (isNaN(validDiscount) || validDiscount < 0 || validDiscount > 100) {
      return res.status(400).json({
        error: "Descuento inválido, debe ser un número entre 0 y 100",
      });
    }

    const createProductData = {
      name,
      price,
      discount: validDiscount || 0, // Establece descuento a 0 si no está definido
      description,
      section,
      isFeatured: isFeatured || false,
      user_id: req.user._id,
      isActive: true,
    };

    if (section === "opcion3") {
      createProductData.generalStock = parseInt(generalStock) || 0;
    } else {
      createProductData.sizes = sizes.map((sizeData) => ({
        size: sizeData.size,
        stock: sizeData.stock,
      }));
    }

    let newProduct;
    if (esAdministrador(req.user)) {
      newProduct = new Vista(createProductData);
    } else {
      newProduct = new Product(createProductData);
    }

    await connectToDatabase();
    await newProduct.save();

    const imagePaths = req.files ? req.files.map((file) => file.location) : [];

    // Comprobación de imágenes para agregar la imagen predeterminada
    if (imagePaths.length === 1) {
      const defaultImage =
        "https://moda-modesta.s3.us-east-2.amazonaws.com/23058b8b-7991-4030-8511-9e137592c1f0.jpg";
      imagePaths.push(defaultImage); // Agrega la imagen predeterminada si solo hay una imagen
    }

    newProduct.imagePath = imagePaths;
    await newProduct.save(); // Guarda el producto con las rutas de imagen

    res.json({ message: "Producto guardado" });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default createProduct;
