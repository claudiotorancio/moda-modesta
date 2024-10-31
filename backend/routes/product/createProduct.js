import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const createProduct = async (req, res) => {
  try {
    // Obtén las rutas de las imágenes
    const imagePaths = req.files ? req.files.map((file) => file.location) : [];
    const { name, price, description, section, isFeatured, generalStock } =
      req.body;
    console.log;
    // Procesa los tamaños y el stock si la sección NO es "Diversos"
    let sizes = [];
    if (section !== "opcion3") {
      sizes = JSON.parse(req.body.sizes || "[]"); // Convierte el JSON de vuelta a un array si hay tallas
    }

    // Crear datos del producto según la sección
    const createProductData = {
      name,
      price,
      description,
      section,
      isFeatured: isFeatured || false,
      user_id: req.user._id,
      isActive: true, // La propiedad isActive es true por defecto
    };

    // Si la sección es "Diversos", agrega el stock general
    if (section === "opcion3") {
      createProductData.generalStock = parseInt(generalStock) || 0;
      // Asegúrate de que imagePath esté vacío o asigne imágenes específicas si es necesario
      createProductData.imagePath = imagePaths; // O asigna imágenes específicas aquí si es necesario
    } else {
      // Si no es "Diversos", agrega las tallas y el stock por talla
      createProductData.sizes = sizes.map((sizeData) => ({
        size: sizeData.size,
        stock: sizeData.stock,
      }));
      // Asignar las rutas de imagen
      createProductData.imagePath = imagePaths;
    }

    // Crear y guardar el producto
    let newProduct;
    if (esAdministrador(req.user)) {
      newProduct = new Vista(createProductData); // Crear en el modelo Vista si es admin
    } else {
      newProduct = new Product(createProductData); // Crear en el modelo Product si no es admin
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
