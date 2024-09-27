import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import helpers from "./helpers.js";
import MONGODB_URI from "../config.js";
import Users from "../models/User.js";

//connect to database

await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SignIn
passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await Users.findOne({ username: username });

        if (user) {
          const validPassword = await helpers.matchPassword(
            password,
            user.password
          );

          if (validPassword) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        } else {
          return done(null, false, { message: "The username does not exist" });
        }
      } catch (err) {
        return done(err, false, { message: "An error occurred" });
      }
    }
  )
);

// passport.use('local.update', new LocalStrategy({
//     usernameField: 'newUsername', // Cambiar al campo de nuevo nombre de usuario
//     passwordField: 'newPassword', // Cambiar al campo de nueva contraseña
//     passReqToCallback: true
// }, async (req, newUsername, newPassword, done) => {
//     try {
//         // Verificar si el usuario está autenticado (puedes omitir este paso si no es necesario)
//         // if (!req.isAuthenticated()) {
//         //     return done(null, false, { message: 'Usuario no autenticado' });
//         // }

//         // Obtener el usuario desde el req.body
//         const  {id}  = req.params // Asegúrate de enviar el userId desde el cliente

// // console.log(`id de usuario: ${newUsername}`)

// console.log(`id de usuario: ${id}`)

// // // const {newUsername, newPassword} = req.body

// // // console.log(`req.body: ${req.body}`);

//         // const {newData} = req.body

//         // console.log(newData)

//         // Buscar el usuario en la base de datos por su ID
//         const user = await Users.findById(id);
// console.log(user)

//         // Verificar si se encontró el usuario
//         if (!user) {
//             return done(null, false, { message: 'Usuario no encontrado' });
//         }

//         // Actualizar el nombre de usuario y la contraseña
//         user.username = newUsername;
//         user.password = await helpers.encryptPassword(newPassword);
//         await user.save();

//         // Devolver el usuario actualizado
//         return done(null, user);
//     } catch (err) {
//         return done(err, false, { message: 'Error al actualizar usuario' });
//     }
// }));

//SignUp

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
          return done(null, false, { message: "Username already taken" });
        }
        const newUser = new Users({
          username: username,
          password: await helpers.encryptPassword(password),
        });
        await newUser.save();

        return done(null, newUser);
      } catch (err) {
        return done(err, false, { message: "Error creating user" });
      }
    }
  )
);

//serialUser

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
