const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  lastName: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  userName: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  companyName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    // unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    // Roles: BUYER_ROLE, SELLER_ROLE, ADMIN_ROLE, MOD_ROLE
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = mongoose.model("User", UsuarioSchema);
