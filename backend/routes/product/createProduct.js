import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import { uploadMultiple } from "../../../api/router.js"; // Asegúrate de que uploadMultiple maneje múltiples imágenes
import Vista from "../../models/Vista.js";

const createProduct = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Llamar a uploadMultiple para manejar la carga de múltiples imágenes
    uploadMultiple(req, res, async (error) => {
      if (error) {
        console.error("Error al cargar las fotos en S3:", error);
        return res
          .status(500)
          .json({ error: "Error al cargar las fotos en S3" });
      }

      // Valores del formulario
      const { name, price, description, section, isFeatured, sizes } = req.body;
      const imagePaths = req.files.map((file) => file.location); // Captura todas las ubicaciones de las imágenes
      const user_id = req.user._id;

      // Verificar que todos los campos requeridos estén presentes
      if (
        !name ||
        !price ||
        !description ||
        !section ||
        isFeatured === undefined ||
        !imagePaths.length
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." });
      }

      // Crear los datos del producto
      const createProductData = {
        name,
        price,
        description,
        section,
        isFeatured,
        sizes: Array.isArray(sizes) ? sizes : [sizes],
        imagePaths, // Almacena los paths de las imágenes
        user_id,
      };

      // Crear un nuevo producto
      let newProduct;
      if (esAdministrador(req.user)) {
        newProduct = new Vista(createProductData);
      } else {
        newProduct = new Product(createProductData);
      }

      // Guardar el producto
      await newProduct.save();
      res.json({ message: "Producto guardado" });
    });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

const esAdministrador = (user) => {
  return user.role === "admin";
};

export default createProduct;
