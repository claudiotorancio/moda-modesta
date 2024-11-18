import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";
import moment from "moment";

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
      discountExpiry,
      sizes: sizesInput,
    } = req.body;

    const parsedDiscountExpiry = discountExpiry
      ? moment.utc(discountExpiry).endOf("day")
      : null;

    // Validar y convertir el descuento a número
    const validDiscount = parseFloat(discount);
    if (isNaN(validDiscount) || validDiscount < 0 || validDiscount > 100) {
      return res.status(400).json({
        error: "Descuento inválido, debe ser un número entre 0 y 100",
      });
    }

    // Manejo de los talles en función de la sección
    let sizes = [];
    if (sizesInput) {
      sizes = JSON.parse(sizesInput).map((sizeData) => ({
        size: sizeData.size,
        stock: parseInt(sizeData.stock, 10) || 0,
      }));
    }

    // Configuración de datos base del producto
    const createProductData = {
      name,
      price,
      discount: validDiscount,
      discountExpiry: parsedDiscountExpiry,
      description,
      section,
      isFeatured: isFeatured || false,
      user_id: req.user._id,
      isActive: true,
      imagePath: [],
    };

    // Manejo específico de stock según sección
    if (generalStock) {
      createProductData.generalStock = parseInt(generalStock, 10) || 0;
    } else {
      createProductData.sizes = sizes;
    }

    // Seleccionar el modelo en función del rol del usuario
    const Model = esAdministrador(req.user) ? Vista : Product;
    const newProduct = new Model(createProductData);

    // Conectar a la base de datos y guardar el producto inicial
    await connectToDatabase();
    await newProduct.save();

    // Guardar rutas de imagen si existen
    const imagePaths = req.files ? req.files.map((file) => file.location) : [];
    if (imagePaths.length === 1) {
      const defaultImage =
        "https://moda-modesta.s3.us-east-2.amazonaws.com/23058b8b-7991-4030-8511-9e137592c1f0.jpg";
      imagePaths.push(defaultImage);
    }

    newProduct.imagePath = imagePaths;
    await newProduct.save(); // Guardar producto con imágenes

    res.json({ message: "Producto guardado exitosamente" });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error interno al crear el producto" });
  }
};

// Función para verificar si el usuario es administrador
const esAdministrador = (user) => user.role === "admin";

export default createProduct;
