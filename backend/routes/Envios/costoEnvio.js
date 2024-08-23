const costoEnvio = async (req, res) => {
  const {
    altoCM,
    codigoPostalDestino,
    codigoPostalOrigen,
    iva,
    profundidadCM,
    anchoCM,
    entrega,
    tipo,
    pesoPaqueteKG,
  } = req.body;

  console.log(req.body);

  try {
    const url = `https://api-correo-argentino-paq-ar.p.rapidapi.com/precio/${codigoPostalOrigen}/${codigoPostalDestino}/${iva}/${tipo}/${entrega}/${pesoPaqueteKG}/${altoCM}/${anchoCM}/${profundidadCM}`;

    console.log(url);

    // Aquí podrías hacer la solicitud a la API usando fetch o axios
    // y devolver la respuesta al cliente
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.API_KEY_ENVIO, // Reemplaza con tu clave de API
        "X-RapidAPI-Host": process.env.API_KEY_ENVIO_CONTACTO,
      },
    });

    if (!response.ok) {
      throw new Error("Error al consultar la API de Correo Argentino");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al procesar envio:", error.message);
    res.status(500).send({ error: "Error al enviar los datos." });
  }
};

export default costoEnvio;
