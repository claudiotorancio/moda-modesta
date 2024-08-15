//logout.js

const logout = (req, res) => {
   try{
    //manejo de passport para el logout
   req.logout( (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Error during logout' });
        }

        console.log('Logout exitoso');
        return res.status(200).json({ success: true, message: 'Logout exitoso' });
    });
} catch (error) {
    console.error('Error en la función logout:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
}

};

export default logout;

