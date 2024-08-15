import mongoose, { Schema, model } from 'mongoose';
import { genSalt, hash as _hash, compare } from 'bcrypt';
import MONGODB_URI from '../config.js';

await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
}, {
  versionKey: false,
});

UsersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    const hashedPassword = await _hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

UsersSchema.methods.comparePassword = function (plainText, callback) {
  return callback(null, compare(plainText, this.password));
};

export default model('Users', UsersSchema);
