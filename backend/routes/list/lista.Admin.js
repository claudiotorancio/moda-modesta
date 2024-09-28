import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const listaAdmin = async (req, res) => {
  try {
    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    // Obtener el listado de usuarios
    const listado = await Users.find();
    const usersCantidad = await Users.countDocuments();

    // Retornar el listado de usuarios
    res.json({ listado, usersCantidad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default listaAdmin;
