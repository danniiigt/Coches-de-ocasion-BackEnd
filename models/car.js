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

CarSchema.methods.toJSON = function () {
  const { __v, _id, ...car } = this.toObject();
  car.uid = _id;
  return car;
};
module.exports = mongoose.model("Car", CarSchema);
