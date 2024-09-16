import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
// import { uploadSingle } from "../../../api/router.js"; // Asegúrate de que uploadMultiple maneje múltiples imágenes
import Vista from "../../models/Vista.js";

const createProduct = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Obtén las rutas de las imágenes
    const imagePaths = req.files ? req.files.map((file) => file.location) : [];
    const { name, price, description, section, isFeatured } = req.body;
    const sizes = req.body["sizes[]"] || []; // Recoge los tamaños enviados como array
    const stock = req.body["stock"] || {}; // Recoge el stock enviado como objeto

    if (
      !name ||
      !price ||
      !description ||
      !section ||
      !isFeatured ||
      !imagePaths.length
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    // Asegúrate de que `sizes` y `stock` estén en el formato correcto
    const sizesArray = Array.isArray(sizes) ? sizes : [sizes];
    const stockObject = {};
    if (typeof stock === "object") {
      for (const [key, value] of Object.entries(stock)) {
        if (value) {
          stockObject[key] = parseInt(value);
        }
      }
    }
    console.log(sizesArray);
    const createProductData = {
      name,
      price,
      description,
      section,
      isFeatured,
      imagePath: imagePaths,
      user_id: req.user._id,
      sizes: sizesArray.map((size) => ({ size, stock: stock[size] || 0 })), // Mapea tamaños con stock
      stock: stockObject,
    };
    console.log(createProductData);
    let newProduct;
    if (esAdministrador(req.user)) {
      newProduct = new Vista(createProductData);
    } else {
      newProduct = new Product(createProductData);
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await newProduct.save();
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
