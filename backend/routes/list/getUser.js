import Users from "../../models/User.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(`id usuario: ${userId}`);

    // Conectar a la base de datos mediante serverless function
    await connectToDatabase();

    // Obtener el user
    const user = await Users.findById(userId);
    console.log(user);

    // Retornar el user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUser;
