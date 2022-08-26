const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CarSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  carTags: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  carData: {
    type: Object,
    required: true,
  },
  state: {
    type: String,
  },
});

// UsuarioSchema.methods.toJSON = function () {
//   const { __v, password, _id, ...usuario } = this.toObject();
//   usuario.uid = _id;
//   return usuario;
// };
module.exports = mongoose.model("Car", CarSchema);
