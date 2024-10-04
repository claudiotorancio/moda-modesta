import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// import CookieStrategy from "passport-cookie";

import helpers from "./helpers.js";

import Users from "../models/User.js";
import { connectToDatabase } from "../db/connectToDatabase.js";

//connect to database

await connectToDatabase();

// SignIn
passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await Users.findOne({ email: email });

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
        console.log(err.stack);
        return done(err, false, { message: "An error occurred" });
      }
    }
  )
);

//serialUser

passport.serializeUser((user, done) => {
  try {
    const id = user.id;
    done(null, id);
  } catch (error) {
    console.log(error.stack);
    done(error, false);
  }
});

//deserializerUser

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

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
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (!email || !password) {
        return done(null, false, {
          message: "Email and password are required.",
        });
      }
      try {
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
          return done(null, false, { message: "Email already taken" });
        }
        const newUser = new Users({
          email: email,
          password: await helpers.encryptPassword(password),
        });

        await newUser.save();

        return done(null, newUser);
      } catch (err) {
        console.error("Error creating user:", err); // Agrega un log para ver errores
        return done(err, false, { message: "Error creating user" });
      }
    }
  )
);

// // Use CookieStrategy
// passport.use(
//   "cookie",
//   new CookieStrategy(
//     {
//       cookieName: "user_sid", // Asegúrate de que coincida con el nombre de tu cookie
//       signed: true,
//       passReqToCallback: true,
//     },
//     async (req, id, done) => {
//       // Change token to userId or whatever identifier you are using
//       console.log("id Cookie", id);
//       try {
//         // Assuming you store user ID in the cookie, you can fetch the user by ID
//         const user = await Users.findById(id);
//         if (!user) {
//           return done(null, false); // User not found
//         }
//         return done(null, user); // User authenticated
//       } catch (err) {
//         return done(err); // Error handling
//       }
//     }
//   )
// );

export default passport;
