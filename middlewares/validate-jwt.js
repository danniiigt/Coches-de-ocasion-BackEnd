const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "You must include a token in the headers (x-token).",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT);

    // Leer el usuario que corresponde al uid
    const user = await User.findById(uid);

    // Verificar que el usuario no sea undefined
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "There is no user in the Database",
      });
    }

    // Verificar que el usuario esté dado de alta (estado: true)
    if (!user.state) {
      return res.status(401).json({
        ok: false,
        msg: "The user is disabled",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

module.exports = { validateJWT };
