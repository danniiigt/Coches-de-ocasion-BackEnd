const { Router } = require("express");
const { check } = require("express-validator");
const { existsCarById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-role");
const router = Router();
const Car = require("../models/car");

router.get("/", async (req, res) => {
  const { page = 1, limit = 15 } = req.query;
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
    .sort({ _id: -1 });

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

router.get("/count", async (req, res) => {
  const carsCount = await Car.countDocuments();

  res.json({
    cars: carsCount,
  });
});

router.get("/:carbrand", async (req, res) => {
  const { carbrand } = req.params;
  const { page = 1, limit = 15 } = req.query;
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
    .sort({ _id: -1 });

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

  res.json({ page, maxPages, total: cars.length, documentCount, cars });
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
