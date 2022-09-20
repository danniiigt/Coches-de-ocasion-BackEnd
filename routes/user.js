const { Router } = require("express");
const { validateFields } = require("../middlewares/validate-fields");
const { check } = require("express-validator");
const {
  isValidUserID,
  isValidRole,
  isEmailTaken,
  isUserNameTaken,
  isActiveAccount,
} = require("../helpers/db-validators");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole } = require("../middlewares/validate-role");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

router.get("/", async (req, res) => {
  const { limit = 10, start = 0 } = req.query;
  const users = await User.find().skip(start).limit(limit);

  res.json({
    limit,
    start,
    users,
  });
});

router.get(
  "/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    check("id").custom((id) => isValidUserID(id)),
    validateFields,
  ],
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      res.json({
        user,
      });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.post(
  "/",
  [
    check("email", "The email isnt valid").isEmail(),
    check("password", "Password must have atleast 6 characters").isLength({
      min: 6,
    }),
    check("userName").custom((userName) => isUserNameTaken(userName)),
    check("role").custom((role) => isValidRole(role)),
    check("email").custom((email) => isEmailTaken(email)),
    validateFields,
  ],
  async (req, res) => {
    let { firstName, lastName, userName, email, password, img, role, phone } =
      req.body;

    //Encrypting the password
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    try {
      const user = new User({
        firstName,
        lastName,
        userName,
        email,
        password,
        img,
        role,
        phone,
      });

      await user.save();
      const token = await generateJWT(user);

      res.json({
        user,
        token,
      });
    } catch (error) {
      res.json({
        error,
      });

      console.log(error);
    }
  }
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "The user ID is necessary").not().isEmpty(),
    check("id", "The user ID is wrong").isMongoId(),
    check("id").custom((id) => isActiveAccount(id)),
    validateFields,
  ],
  async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json({ msg: "The user have been disabled succesfully", user });
  }
);

module.exports = router;
