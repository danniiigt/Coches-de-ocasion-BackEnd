const User = require("../models/user");
const Role = require("../models/role");
const Car = require("../models/car");
const Brand = require("../models/brand");

const isValidUserID = async (id = "") => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error("There is no user with the provided ID");
  }
};

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ name: role });

  if (!roleExists) {
    throw new Error("The role introduced doesn't exists");
  }
};

const existsCarById = async (id = "") => {
  const existsCar = await Car.findById(id);

  if (!existsCar) {
    throw new Error("There is no car with the provided ID");
  }
};

const existsRoleWithName = async (name = "") => {
  const roleExists = await Role.findOne({ name });

  if (roleExists) {
    throw new Error("This role is already in the database");
  }
};

const isEmailTaken = async (email = "") => {
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new Error("The email is already taken");
  }
};

const isUserNameTaken = async (userName = "") => {
  if (userName !== "") {
    const userNameExists = await User.findOne({ userName });

    if (userNameExists) {
      throw new Error("The username is already taken");
    }
  }
};

const isActiveAccount = async (id = "") => {
  const user = await User.findById(id);

  if (!user.state) {
    throw new Error("The user is disabled");
  }
};

const carBrandExists = async (brandName = "") => {
  const brands = await Brand.find();

  brands.forEach((brand) => {
    if (brand.name === brandName) {
      return true;
    }
  });

  return false;
};

module.exports = {
  isValidUserID,
  existsRoleWithName,
  isValidRole,
  isEmailTaken,
  isUserNameTaken,
  isActiveAccount,
  existsCarById,
  carBrandExists,
};
