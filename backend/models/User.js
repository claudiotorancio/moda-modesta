//modelo para usuario

import { Schema, model } from "mongoose";

const UsersSchema = new Schema({
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
    created_at: { type: Date, default: Date.now }
}, {
    versionKey: false
});

export default model('Users', UsersSchema)