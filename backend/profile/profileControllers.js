import Users from "../models/User.js";
import { connectToDatabase } from "../db/connectToDatabase.js";
import Order from "../models/Order.js";

export const profileControllers = {
  async InfoPersonal(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión." });
      }

      const userId = req.user._id;
      connectToDatabase();
      const user = await Users.findById(userId).select("nombre email");

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error al obtener la información personal." });
    }
  },

  async pedidosRecientes(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión." });
      }

      const userId = req.user._id;
      const orders = await Order.find({ "customer.userId": userId });

      if (!orders) {
        return res
          .status(404)
          .json({ error: "No se encontraron pedidos recientes." });
      }

      res.json(orders);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error al obtener los pedidos recientes." });
    }
  },
};
