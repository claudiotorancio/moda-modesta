import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import { uploadMultiple } from "../../../api/router.js"; // Asegúrate de que uploadMultiple maneje múltiples imágenes
import Vista from "../../models/Vista.js";

const createProduct = async (req, res) => {
  try {
    uploadMultiple(req, res, async (error) => {
      if (error) {
        console.error("Error al cargar las fotos en S3:", error);
        return res
          .status(500)
          .json({ error: "Error al cargar las fotos en S3" });
      }

      // Asegúrate de que req.files esté disponible
      const imagePaths = req.files.map((file) => file.location);
      const { name, price, description, section, isFeatured, sizes } = req.body;
      console.log(imagePaths);
      console.log(req.body);
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

      // Crear los datos del producto
      const createProductData = {
        name,
        price,
        description,
        section,
        isFeatured,
        sizes: Array.isArray(sizes) ? sizes : [sizes],
        imagePaths,
        user_id: req.user._id,
      };

      // Crear un nuevo producto
      let newProduct;
      if (esAdministrador(req.user)) {
        newProduct = new Vista(createProductData);
      } else {
        newProduct = new Product(createProductData);
      }

      // Conectar a la base de datos y guardar el producto
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

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
