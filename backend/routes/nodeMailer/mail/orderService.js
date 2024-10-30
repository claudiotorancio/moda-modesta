import Order from "../../../models/Order.js";
import Sale from "../../../models/Sales.js";
import Vista from "../../../models/Vista.js";
import CustomerAnalytic from "../../../models/CustomerAnalytics.js";

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
    aceptar = false,
    enCamino = false,
    finalizado = false,
    cancelado = false,
  } = data;

  console.log(data);

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
    cancelado,
  });

  console.log(newOrder);
  await newOrder.save();

  return newOrder;
};

export const saveCustomerAnalytics = async (userId, productos) => {
  // Obtener el cliente y sus compras previas
  const analytics = await CustomerAnalytic.findOne({ customerId: userId });

  const totalGastado = productos.reduce(
    (acc, producto) => acc + producto.price * producto.cantidad,
    0
  );
  const now = new Date();

  if (analytics) {
    // Actualizar datos del cliente existente
    analytics.totalSpent += totalGastado;
    analytics.totalOrders += 1;
    analytics.lastOrderDate = now;
    analytics.frecuencia = analytics.frecuencia + 1; // O lógica personalizada para la frecuencia
    analytics.valorPromedio = analytics.totalSpent / analytics.totalOrders;

    await analytics.save();
  } else {
    // Crear un nuevo registro de análisis del cliente
    const newAnalytics = new CustomerAnalytic({
      customerId: userId,
      totalSpent: totalGastado,
      totalOrders: 1,
      lastOrderDate: now,
      frecuencia: 1,
      valorPromedio: totalGastado, // O personalizar según tus necesidades
    });

    await newAnalytics.save();
  }
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
