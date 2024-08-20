// modelo para usuario

import { Schema, model } from "mongoose";

const TestSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    emailVerified: { // Nuevo campo para verificar el correo electrónico
        type: Boolean,
        default: false
    },
    created_at: { type: Date, default: Date.now }
}, {
    versionKey: false
});

export default model('Test', TestSchema);