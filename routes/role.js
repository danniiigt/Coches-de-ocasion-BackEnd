const { Router } = require("express");
const { existsRoleWithName } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const { check } = require("express-validator");
const Role = require("../models/role");
const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, start = 0 } = req.query;
  const roles = await Role.find().skip(start).limit(limit);

  if (roles.length === 0) {
    res.json({
      msg: "There is not roles in the database yet",
    });
  } else {
    res.json({
      roles,
    });
  }
});

router.post(
  "/",
  [check("name").custom((name) => existsRoleWithName(name)), validateFields],
  async (req, res) => {
    const { name } = req.body;

    try {
      const role = new Role({ name });
      await role.save();

      res.json({
        msg: "New role created succesfully",
        role,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
