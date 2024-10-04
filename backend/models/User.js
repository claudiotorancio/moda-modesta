// modelo para usuario

import { Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emailVerified: {
      // Nuevo campo para verificar el correo electrónico
      type: Boolean,
      default: false,
    },
    resetToken: { type: String }, // Campo adicional para almacenar el token
    resetTokenExpires: { type: Date }, // Tiempo de expiración opcional
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export default model("Users", UsersSchema);
