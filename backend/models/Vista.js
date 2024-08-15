//modelo para productos

import { Schema, model } from "mongoose";

const VistaSchema = new Schema ({
    role: {type: String},
    name: {type: String},
    price: {type: String},
    imagePath: {type: String},
    description: {type: String},
    section:{type: String},
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    created_at: {type: Date, default: Date.now}
}, {
    versionKey:false
});

export default model('Vista', VistaSchema)