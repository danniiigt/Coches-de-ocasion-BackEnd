const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const RoleSchema = new Schema({
  name: {
    type: String,
    required: [true, "A role name is needed"],
    unique: true,
  },
});

RoleSchema.methods.toJSON = function () {
  const { __v, ...role } = this.toObject();
  return role;
};

module.exports = mongoose.model("Role", RoleSchema);
