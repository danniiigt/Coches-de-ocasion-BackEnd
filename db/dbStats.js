const Car = require("../models/car");
const User = require("../models/user");
const Role = require("../models/role");
const Brand = require("../models/brand");
const mongoose = require("mongoose");
const fs = require("fs");

const getDbStats = async () => {
  const carsCount = await Car.countDocuments();
  const usersCount = await User.countDocuments();
  const rolesCount = await Role.countDocuments();
  const brandsCount = await Brand.countDocuments();
  console.log(`\n Database Info \n`.bgMagenta.bold);

  console.log(
    `${`>`.green} Un total de ${`${carsCount}`.magenta} coches registrados`.gray
  );
  console.log(
    `${`>`.green} Un total de ${`${usersCount}`.magenta} usuarios registrados`
      .gray
  );
  console.log(
    `${`>`.green} Un total de ${`${rolesCount}`.magenta} roles registrados`.gray
  );
  console.log(
    `${`>`.green} Un total de ${`${brandsCount}`.magenta} marcas registradas`
      .gray
  );

  const routes = await fs.readdirSync("./routes");
  console.log(`\n Routes Info - ${routes.length} endpoints \n`.bgMagenta.bold);
  console.log(`${`>`.green} Endpoint: "${`/`.magenta}"`);
  routes.forEach((route) => {
    route = route.substring(0, route.length - 3);
    if (route !== "route") {
      console.log(`${`>`.green} Endpoint: "${`/api/${route}s`.magenta}"`);
    }
  });
};

module.exports = {
  getDbStats,
};
