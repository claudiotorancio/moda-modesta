// Configuración del modo
export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://moda-modesta.vercel.app"
    : "http://localhost:3000";
