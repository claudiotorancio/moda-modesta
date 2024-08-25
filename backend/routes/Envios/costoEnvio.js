// costoEnvio.js

const costoEnvio = async (req, res) => {
  const { cpOrigen, cpDestino, provinciaOrigen, provinciaDestino, peso } =
    req.body;

  try {
    const url = `https://correo-argentino1.p.rapidapi.com/calcularPrecio?cpOrigen=${cpOrigen}&cpDestino=${cpDestino}&provinciaOrigen=${provinciaOrigen}&provinciaDestino=${provinciaDestino}&peso=${peso}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.API_KEY_ENVIO, // Reemplaza con tu clave de API
        "X-RapidAPI-Host": process.env.API_KEY_ENVIO_CONTACTO,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error al consultar la API de Correo Argentino",
      error.message
    );
    res
      .status(500)
      .send({ error: "Error al consultar la API de Correo Argentino" });
  }
};

export default costoEnvio;
