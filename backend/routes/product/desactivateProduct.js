import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";
// import AWS from "aws-sdk";

// // Conectar con S3 para eliminar las imágenes
// const s3 = new AWS.S3({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: {
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   },
// });

const deactivateProduct = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    const productId = req.params.id;

    // Encontrar el producto y marcarlo como inactivo
    const producto = await Vista.findById(productId);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar el estado del producto para desactivarlo
    producto.isActive = false;
    await producto.save();

    // // Si el producto tiene imágenes y deseas eliminarlas
    // const imagePaths = productoDesactivado.imagePath;

    // if (Array.isArray(imagePaths)) {
    //   for (const imagePath of imagePaths) {
    //     const nombreDeArchivo = imagePath.split("/").pop();

    //     const params = {
    //       Bucket: process.env.BUCKET_AWS,
    //       Key: nombreDeArchivo,
    //     };

    //     s3.deleteObject(params, (err, data) => {
    //       if (err) {
    //         console.error("Error al eliminar la imagen en S3:", err);
    //       } else {
    //         console.log("Imagen eliminada con éxito en S3:", data);
    //       }
    //     });
    //   }
    // }

    res.json({ message: "Producto desactivado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deactivateProduct;

// mongoose from "mongoose";
// import MONGODB_URI from "../../config.js";
// import Product from "../../models/Product.js";
// import AWS from "aws-sdk";
// import Vista from "../../models/Vista.js";

// // Conectar con S3 para eliminar las imágenes
// const s3 = new AWS.S3({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: {
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   },
// });

// const deleteProduct = async (req, res) => {
//   try {
//     if (!req.isAuthenticated()) {
//       return res.status(401).json({ error: "Usuario no autenticado" });
//     }

//     // Conectar a la base de datos mediante serverless function
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const productId = req.params.id;

//     // Eliminar el producto del modelo Vista o Product
//     const eliminarProduct = await Vista.findByIdAndDelete(productId);

//     if (!eliminarProduct) {
//       return res.status(404).json({ message: "Producto no encontrado" });
//     }

//     // Iterar sobre el array de imagePath y eliminar cada imagen en S3
//     const imagePaths = eliminarProduct.imagePath;

//     if (Array.isArray(imagePaths)) {
//       for (const imagePath of imagePaths) {
//         const nombreDeArchivo = imagePath.split("/").pop();

//         const params = {
//           Bucket: process.env.BUCKET_AWS,
//           Key: nombreDeArchivo,
//         };

//         s3.deleteObject(params, (err, data) => {
//           if (err) {
//             console.error("Error al eliminar la imagen en S3:", err);
//           } else {
//             console.log("Imagen eliminada con éxito en S3:", data);
//           }
//         });
//       }
//     }

//     res.json({ message: "Producto eliminado" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export default deleteProduct;
