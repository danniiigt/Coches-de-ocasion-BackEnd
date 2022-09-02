const { Router } = require("express");
const { check } = require("express-validator");
const { existsCarById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-role");
const router = Router();
const Car = require("../models/car");

router.get("/", async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  if (page == 1 && limit == 0) {
    const cars = await Car.find().sort({ _id: -1 });

    for (const car of cars) {
      car.images = await [car.images[0]];
    }
    res.json({ total: cars.length, cars });
  } else if (page == 1) {
    const cars = await Car.find().limit(limit).sort({ _id: -1 });
    for (const car of cars) {
      car.images = await [car.images[0]];
    }

    res.json({ page, total: limit, cars });
  } else if (page > 1) {
    const cars = await Car.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 });

    for (const car of cars) {
      car.images = await [car.images[0]];
    }
    res.json({ page, total: limit, cars });
  }
});

router.get("/count", async (req, res) => {
  const carsCount = await Car.countDocuments();

  res.json({
    cars: carsCount,
  });
});

router.get("/:carbrand", async (req, res) => {
  const { carbrand } = req.params;
  const regex = new RegExp(carbrand, "i");

  const carsDb = await Car.find({ title: regex }).sort({ _id: -1 });

  for (const car of carsDb) {
    car.images = await [car.images[0]];
  }

  res.json({
    total: carsDb.length,
    cars: carsDb,
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
