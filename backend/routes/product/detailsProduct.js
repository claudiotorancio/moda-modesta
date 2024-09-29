import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const detailsProduct = async (req, res) => {
  try {
    //buscar producto con su id
    const productId = req.params.id;
    //conectar a base de datos mediante serverless function
    await connectToDatabase();

    const producto = await Vista.findById(productId);

    res.json(producto);
  } catch (error) {
    console.error(error);
  }
};

export default detailsProduct;
