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
  } = data;

  // console.log(data);

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
      discount: producto.discount,
      quantity: producto.cantidad,
      size: producto.size,
      hash: `https://moda-modesta.vercel.app/#product-${producto.hash}`,
      category: producto.category,
    })),
    totalAmount: total,
    shippingCost: costoEnvio,
    destination: {
      province: provincia,
      postalCode: codigoPostal,
    },
    checked,
  });

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
    name: producto.name, // Guardar el nombre del producto al momento de la venta
    price: producto.price * (1 - producto.discount / 100), // Guardar el precio al momento de la venta
    quantity: producto.cantidad,
    discount: producto.discount,
    totalPrice:
      producto.price * producto.cantidad * (1 - producto.discount / 100),
    category: producto.category,
    customerId: userId,
    orderId,
    size: producto.size, // Guardar el tamaño al momento de la venta
    hash: producto.hash, // Guardar el hash o link si es necesario
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
