import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Product from "../../models/Product.js";
import Vista from "../../models/Vista.js";

const listaProductosAdmin = async (req, res) => {
  // console.log(req.user);
  try {
    //Relacionar id de usuario con producto para visualizar solo sus productos
    const user_id = req.user._id;

    // Conectar a la base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //Verificar si el usuario esta autenticado

    const usuarioAdmin = req.user.role === "admin";
    console.log(usuarioAdmin);

    let products;
    //Verificar si el usuario es administrador
    if (req.user.role === "admin") {
      // Si es administrador, buscar productos utilizando el modelo Vista
      products = await Vista.find({ user_id: user_id });
    } else {
      // Si no es administrador, buscar productos utilizando el modelo Product
      products = await Product.find({ user_id: user_id });
    }

    res.json(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export default listaProductosAdmin;

// import mongoose from "mongoose";
// import MONGODB_URI from "../../config.js";
// import Product from "../../models/Product.js";
// import Vista from "../../models/Vista.js";

// const renderProducts = async (req, res) => {
//   console.log(req.user);
//   try {
//     //Relacionar id de usuario con producto para visualizar solo sus productos
//     const user_id = req.params.id;

//     // Conectar a la base de datos mediante serverless function
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     //Verificar si el usuario esta autenticado

//     // const usuarioHaIniciadoSesion = req.isAuthenticated();
//     const usuarioAdmin = req.params.id;
//     console.log(usuarioAdmin);

//     let products;
//     //Verificar si el usuario es administrador
//     // if (req.user.role === "admin") {
//     // Si es administrador, buscar productos utilizando el modelo Vista
//     products = await Vista.find({ user_id: user_id });
//     // } else {
//     //   // Si no es administrador, buscar productos utilizando el modelo Product
//     //   products = await Product.find({ user_id: user_id });
//     // }

//     // const totalProduct = await Product.countDocuments();
//     const totalVista = await Vista.countDocuments();

//     res.json({
//       usuarioAdmin,
//       // usuarioHaIniciadoSesion,
//       products,
//       // total: totalProduct + totalVista,
//     });
//   } catch (error) {
//     console.error("Error al cargar productos:", error);
//     res.status(500).json({ error: "Error al cargar productos" });
//   }
// };

// export default renderProducts;
