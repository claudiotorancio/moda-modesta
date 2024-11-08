import app from "../api/router.js";

//manejo de puerto acorde al modo dev o prod

const PORT = process.env.PORT || 3000;

// escuchar puerto
app.listen(PORT);
console.log("Server on Port: ", PORT);
