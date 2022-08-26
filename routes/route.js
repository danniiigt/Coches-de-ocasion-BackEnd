const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  res.json({
    ok: true,
    msg: "El API funciona correctamente",
  });
});

module.exports = router;
