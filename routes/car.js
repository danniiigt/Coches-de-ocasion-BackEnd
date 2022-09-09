const { Router } = require("express");
const { check } = require("express-validator");
const { existsCarById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-role");
const router = Router();
const Car = require("../models/car");

router.post("/", async (req, res) => {
  let { page = 1, limit = 15, orderBy = "recent" } = req.query;
  const {
    kmMin,
    kmMax,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    brand,
    gearBox,
    hpMin,
    hpMax,
    doors,
  } = req.body;

  let orderByDB = orderBy;
  switch (orderByDB) {
    case "recent":
      orderByDB = { _id: -1 };
      break;
    case "hp-desc":
      orderByDB = { "carTags.horsePower": -1 };
      break;
    case "hp-asc":
      orderByDB = { "carTags.horsePower": +1 };
      break;
    case "km-desc":
      orderByDB = { "carTags.kilometers": -1 };
      break;
    case "km-asc":
      orderByDB = { "carTags.kilometers": +1 };
      break;
    case "price-desc":
      orderByDB = { price: -1 };
      break;
    case "price-asc":
      orderByDB = { price: +1 };
      break;
    case "year-desc":
      orderByDB = { "carTags.year": -1 };
      break;
    case "year-asc":
      orderByDB = { "carTags.year": +1 };
      break;

    default:
      orderByDB = { _id: -1 };
      break;
  }

  page = parseInt(page);
  limit = parseInt(limit);

  const brandRegex = new RegExp(brand, "i");

  const cars = await Car.find({
    price: { $gte: priceMin || 0, $lte: priceMax || 10000000 },
    "carTags.kilometers": { $gte: kmMin || 0, $lte: kmMax || 10000000 },
    "carTags.year": { $gte: yearMin || 0, $lte: yearMax || 10000000 },
    title: brandRegex,
    "carTags.horsePower": { $gte: hpMin || 0, $lte: hpMax || 10000000 },
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(orderByDB);
  // .sort({ _id: -1 });
  // .sort({ price: -1 }); // FILTRANDO POR PRECIOS DE MAS CAROS A MAS BARATOS

  const documentCount = await Car.find({
    price: { $gte: priceMin || 0, $lte: priceMax || 10000000 },
    "carTags.kilometers": { $gte: kmMin || 0, $lte: kmMax || 10000000 },
    "carTags.year": { $gte: yearMin || 0, $lte: yearMax || 10000000 },
    title: brandRegex,
    "carTags.horsePower": { $gte: hpMin || 0, $lte: hpMax || 10000000 },
  }).countDocuments();

  const maxPages = Math.ceil(documentCount / limit);

  for (const car of cars) {
    car.images = await [car.images[0]];
  }

  res.json({
    page,
    maxPages,
    orderBy,
    querys: {
      kmMin,
      kmMax,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      brand,
      gearBox,
      hpMin,
      hpMax,
      doors,
    },
    total: cars.length,
    cars,
  });
});

router.get(
  "/:id",
  [
    check("id", "The provided ID is not valid").isMongoId(),
    check("id").custom((id) => existsCarById(id)),
    validateFields,
  ],

  async (req, res) => {
    const { id } = req.params;
    const car = await Car.findById(id);

    res.json(car);
  }
);

router.get("/count", async (req, res) => {
  const carsCount = await Car.countDocuments();

  res.json({
    cars: carsCount,
  });
});

router.post("/marca/:carbrand", async (req, res) => {
  const { carbrand } = req.params;
  let { page = 1, limit = 15, orderBy = "recent" } = req.query;
  const {
    kmMin,
    kmMax,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    brand,
    gearBox,
    hpMin,
    hpMax,
    doors,
  } = req.body;

  let orderByDB = orderBy;
  switch (orderByDB) {
    case "recent":
      orderByDB = { _id: -1 };
      break;
    case "hp-desc":
      orderByDB = { "carTags.horsePower": -1 };
      break;
    case "hp-asc":
      orderByDB = { "carTags.horsePower": +1 };
      break;
    case "km-desc":
      orderByDB = { "carTags.kilometers": -1 };
      break;
    case "km-asc":
      orderByDB = { "carTags.kilometers": +1 };
      break;
    case "price-desc":
      orderByDB = { price: -1 };
      break;
    case "price-asc":
      orderByDB = { price: +1 };
      break;
    case "year-desc":
      orderByDB = { "carTags.year": -1 };
      break;
    case "year-asc":
      orderByDB = { "carTags.year": +1 };
      break;

    default:
      orderByDB = { _id: -1 };
      break;
  }

  page = parseInt(page);
  limit = parseInt(limit);

  const regex = new RegExp(carbrand, "i");

  const cars = await Car.find({
    price: { $gte: priceMin || 0, $lte: priceMax || 10000000 },
    "carTags.kilometers": { $gte: kmMin || 0, $lte: kmMax || 10000000 },
    "carTags.year": { $gte: yearMin || 0, $lte: yearMax || 10000000 },
    title: regex,
    "carTags.horsePower": { $gte: hpMin || 0, $lte: hpMax || 10000000 },
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(orderByDB);

  const documentCount = await Car.find({
    price: { $gte: priceMin || 0, $lte: priceMax || 10000000 },
    "carTags.kilometers": { $gte: kmMin || 0, $lte: kmMax || 10000000 },
    "carTags.year": { $gte: yearMin || 0, $lte: yearMax || 10000000 },
    title: regex,
    "carTags.horsePower": { $gte: hpMin || 0, $lte: hpMax || 10000000 },
  }).countDocuments();

  const maxPages = Math.ceil(documentCount / limit);

  for (const car of cars) {
    car.images = await [car.images[0]];
  }

  res.json({
    page,
    maxPages,
    orderBy,
    total: cars.length,
    documentCount,
    cars,
  });
});

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "The ID is wrong").isMongoId(),
    check("id").custom((id) => existsCarById(id)),
    validateFields,
  ],
  async (req, res) => {
    const { id } = req.params;

    const carDeleted = await Car.findById(id);

    if (carDeleted.state === undefined || null) {
      carDeleted.state = "sold";
      await carDeleted.save();

      res.json({
        msg: "Car marked as SOLD",
        carDeleted,
      });
    } else {
      res.json({
        ok: false,
        msg: "Car is already SOLD!",
      });
    }
  }
);

module.exports = router;
