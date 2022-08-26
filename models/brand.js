const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

BrandSchema.methods.toJSON = function () {
  const { name } = this.toObject();
  return name;
};

module.exports = mongoose.model("Brand", BrandSchema);
