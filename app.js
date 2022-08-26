const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/config");
const { getDbStats } = require("./db/dbStats");
const { saveBrands } = require("./helpers/save-brands");
require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT;

(async () => {
  app.use(express.static(__dirname + "public"));
  app.use(express.json());
  app.use(cors());
  dbConnection();

  //ROUTES
  app.use("/", require("./routes/route.js"));
  app.use("/api/users", require("./routes/user"));
  app.use("/api/roles", require("./routes/role"));
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/cars", require("./routes/car"));
  app.use("/api/brands", require("./routes/brand"));

  //REFRESH BRANDS
  saveBrands();

  app.listen(port);
  console.clear();
  console.log(` Node RestServer - Coches de Ocasión `.bgMagenta.bold);
  console.log(`\n${`>`.green} Url local http://localhost:${port} `.gray);
  console.log(`${`>`.green} Escuchando el puerto ${port} `.gray);
  getDbStats();
})();
