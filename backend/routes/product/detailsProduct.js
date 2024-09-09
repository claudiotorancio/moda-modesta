import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Vista from "../../models/Vista.js";

const detailsProduct = async (req, res) => {
  try {
    //buscar producto con su id
    const productId = req.params.id;
    //conectar a base de datos mediante serverless function
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const product = await Vista.findById(productId);

    res.json({ message: "Product finded", product });
  } catch (error) {
    console.error(error);
  }
};

export default detailsProduct;
