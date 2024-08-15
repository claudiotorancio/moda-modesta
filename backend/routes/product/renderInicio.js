import mongoose from "mongoose";
import MONGODB_URI from "../../config.js";
import Vista from "../../models/Vista.js";


const renderInicio = async (req, res) => {
    try {
      
        // Conectar a la base de datos mediante serverless function
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // consultar productos
        const products = await Vista.find();

        //Devolver productos
        res.json(products);
    
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).json({ error: 'Error al cargar productos' });
    }
};

export default renderInicio;
