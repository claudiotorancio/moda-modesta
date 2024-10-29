// controllers/mail/orderService.js
import Order from "../../../models/Order.js";
import Sale from "../../../models/Sales.js";
import Vista from "../../../models/Vista.js";

export const createOrder = async (data, userId) => {
  const {
    nombre,
    email,
    telefono,
    provincia,
    codigoPostal,
    productos,
    total,
    costoEnvio,
    checked,
    aceptar,
    enCamino,
    finalizado,
  } = data;

  const newOrder = new Order({
    customer: {
      name: nombre,
      email: email,
      phoneNumber: telefono,
      userId,
    },
    items: productos.map((producto) => ({
      productId: producto.id,
      name: producto.name,
      price: producto.price,
      quantity: producto.cantidad,
      size: producto.size,
      hash: `https://moda-modesta.vercel.app/#product-${producto.hash}`,
    })),
    totalAmount: total,
    shippingCost: costoEnvio,
    destination: {
      province: provincia,
      postalCode: codigoPostal,
    },
    checked,
    aceptar,
    enCamino,
    finalizado,
  });
  console.log(newOrder);
  await newOrder.save();
  return newOrder;
};

export const saveSalesData = async (productos, userId, orderId) => {
  const saleData = productos.map((producto) => ({
    date: new Date(),
    productId: producto.id,
    quantity: producto.cantidad,
    totalPrice: producto.price * producto.cantidad,
    category: producto.category,
    customerId: userId,
    orderId,
  }));

  await Promise.all(saleData.map((data) => new Sale(data).save()));
};

export const updateStock = async (productos) => {
  await Promise.all(
    productos.map(async (producto) => {
      const product = await Vista.findById(producto.id);
      if (product) {
        if (product.sizes && product.sizes.length > 0) {
          const size = product.sizes.find((s) => s.size === producto.size);
          if (size) {
            size.stock -= producto.cantidad;
            size.stock = Math.max(size.stock, 0);
            await product.save();
          }
        } else {
          product.generalStock -= producto.cantidad;
          product.generalStock = Math.max(product.generalStock, 0);
          await product.save();
        }
      }
    })
  );
};
