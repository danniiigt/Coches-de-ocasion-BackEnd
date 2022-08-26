const Car = require("../models/car");
const Brand = require("../models/brand");
const { carBrandExists } = require("./db-validators");

const saveBrands = async () => {
  const cars = await Car.find({ state: undefined });

  cars.forEach(async (car) => {
    let carBrand = car.title.split(" ")[0].toUpperCase();
    const brandIsOnDB = await carBrandExists(carBrand);

    try {
      if (!brandIsOnDB) {
        const carBrandDB = await new Brand({ name: carBrand });
        await carBrandDB.save();
      }
    } catch (error) {}
  });
};

module.exports = { saveBrands };
