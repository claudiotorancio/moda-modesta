export function generarOpcionesProvincias(select) {
  if (!select) {
    console.error("Elemento select no encontrado.");
    return;
  }

  const provincias = [
    { codigo: "AR-A", nombre: "Salta" },
    { codigo: "AR-B", nombre: "Buenos Aires" },
    { codigo: "AR-C", nombre: "Ciudad Autónoma de Buenos Aires" },
    { codigo: "AR-D", nombre: "San Luis" },
    { codigo: "AR-E", nombre: "Entre Ríos" },
    { codigo: "AR-F", nombre: "La Rioja" },
    { codigo: "AR-G", nombre: "Santiago del Estero" },
    { codigo: "AR-H", nombre: "Chaco" },
    { codigo: "AR-J", nombre: "San Juan" },
    { codigo: "AR-K", nombre: "Catamarca" },
    { codigo: "AR-L", nombre: "La Pampa" },
    { codigo: "AR-M", nombre: "Mendoza" },
    { codigo: "AR-N", nombre: "Misiones" },
    { codigo: "AR-P", nombre: "Formosa" },
    { codigo: "AR-Q", nombre: "Neuquén" },
    { codigo: "AR-R", nombre: "Río Negro" },
    { codigo: "AR-S", nombre: "Santa Fe" },
    { codigo: "AR-T", nombre: "Tucumán" },
    { codigo: "AR-U", nombre: "Chubut" },
    {
      codigo: "AR-V",
      nombre: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
    },
    { codigo: "AR-W", nombre: "Corrientes" },
    { codigo: "AR-X", nombre: "Córdoba" },
    { codigo: "AR-Y", nombre: "Jujuy" },
    { codigo: "AR-Z", nombre: "Santa Cruz" },
  ];

  provincias.forEach((provincia) => {
    const option = document.createElement("option");
    option.value = provincia.codigo;
    option.textContent = provincia.nombre;
    select.appendChild(option);
  });
}
