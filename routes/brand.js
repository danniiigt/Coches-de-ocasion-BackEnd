const { Router } = require("express");
const router = Router();
const Brand = require("../models/brand");

router.get("/", async (req, res) => {
  const brands = await Brand.find();

  res.json({
    brands,
  });
});

module.exports = router;
