const { Router } = require("express");
const router = Router();
const Usuario = require("../models/user");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/generate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { check } = require("express-validator");
const { validarLoginJWT } = require("../middlewares/validate-jwt");

router.get("/", async (req, res) => {
  validarLoginJWT(req, res);
});

router.post(
  "/login",
  [
    check("email", "An email is needed").isEmail(),
    check("password", "A password is needed").not().isEmpty(),
    validateFields,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Usuario.findOne({ email });

      if (!user) {
        return res.status(400).json({
          msg: "No user with the introduced email",
        });
      }

      if (!user.state) {
        return res.status(400).json({
          msg: "The user is disabled",
        });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({
          msg: "The password introduced is wrong",
        });
      }

      const token = await generateJWT(user);

      res.json({
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Contact with the administrator",
      });
    }
  }
);

module.exports = router;
