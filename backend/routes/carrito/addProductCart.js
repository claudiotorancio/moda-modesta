import Cart from "../../models/Cart.js";
import Vista from "../../models/Vista.js";
import { connectToDatabase } from "../../db/connectToDatabase.js";

const addProductCart = async (req, res) => {
  try {
    const {
      sessionId, // Identificador único para usuarios no logueados
      productId, // ID del producto
      cantidad, // Cantidad a agregar
      unidad, // Unidad (tallas, medidas, etc.)
    } = req.body;

    console.log(req.body);

    // Conectar a la base de datos
    await connectToDatabase();

    // Determinar el userId si el usuario está autenticado
    const userId = req.isAuthenticated() ? req.user._id : null;

    // Usar `userId` si está autenticado, de lo contrario usar `sessionId`
    const currentSessionId = userId || sessionId;

    // Buscar o crear el carrito (por userId o sessionId)
    let cart = await Cart.findOneAndUpdate(
      { userId: userId || null, sessionId: currentSessionId },
      {
        $setOnInsert: {
          sessionId: currentSessionId,
          userId: userId || null,
          items: [],
        },
      },
      { new: true, upsert: true } // Devuelve el carrito actualizado o crea uno nuevo
    );

    // Buscar si el producto ya está en el carrito
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Actualizar la cantidad del producto existente
      existingItem.cantidad += cantidad;
    } else {
      // Buscar los detalles del producto en la colección Vista
      const productDetails = await Vista.findById(productId);

      if (!productDetails) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Agregar el producto como un nuevo ítem en el carrito
      cart.items.push({
        name: productDetails.name,
        price: productDetails.price,
        imagePath: productDetails.imagePath[0],
        unidad,
        cantidad,
        productId: productDetails._id,
        category: productDetails.section,
        discount: productDetails.discount || 0,
        isActive: productDetails.isActive,
      });
    }

    // Calcular el precio total del carrito
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.cantidad,
      0
    );

    // Guardar los cambios en el carrito
    await cart.save();

    // Responder con el carrito actualizado
    res.json({
      message: "Producto agregado al carrito con éxito",
      cart,
      sessionId: currentSessionId, // Enviar el `sessionId` si fue generado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default addProductCart;
