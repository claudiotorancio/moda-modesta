import passport from '../../lib/passport.js'

const signup = async (req, res) => {
    try {
        //cifrar contraseñas con passport
        passport.authenticate('local.signup', function (err, user, info) {
            //manejo de errores
            if (err) {
                throw err;
            }
            if (!user) {
    
                return res.status(400).json({ message: 'Failed to sign up' });
            }
            if(user) {res.json({ message: 'Usuario registrado' })};
        })(req, res);
    } catch (error) {
        // Manejar errores generales aquí
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

   
export default signup;
