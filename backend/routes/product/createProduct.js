import Product from "../../models/Product.js";
// import { uploadSingle } from "../../../api/router.js"; // Asegúrate de que uploadMultiple maneje múltiples imágenes
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const createProduct = async (req, res) => {
  try {
    // Obtén las rutas de las imágenes
    const imagePaths = req.files ? req.files.map((file) => file.location) : [];
    const { name, price, description, section, isFeatured } = req.body;

    // Procesa los tamaños y el stock
    const sizes = JSON.parse(req.body.sizes || "[]"); // Convierte el JSON de vuelta a un array
    const stock = {};

    // Procesa el stock si es un objeto
    if (typeof req.body.stock === "object") {
      for (const [key, value] of Object.entries(req.body.stock)) {
        if (value) {
          stock[key] = parseInt(value);
        }
      }
    }

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

    // Crear datos del producto
    const createProductData = {
      name,
      price,
      description,
      section,
      isFeatured,
      imagePath: imagePaths,
      user_id: req.user._id,
      sizes: sizes.map((sizeData) => ({
        size: sizeData.size,
        stock: sizeData.stock,
      })),
      stock: stock,
      isActive: true, // Agrego la propiedad isActive
    };

    // Crear y guardar el producto
    let newProduct;
    if (esAdministrador(req.user)) {
      newProduct = new Vista(createProductData);
    } else {
      newProduct = new Product(createProductData);
    }

    await connectToDatabase();

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
