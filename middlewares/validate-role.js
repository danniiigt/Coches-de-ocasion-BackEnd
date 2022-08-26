const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (req.user) {
    const user = req.user;

    if (user.role !== "ADMIN_ROLE") {
      return res.status(401).json({
        ok: false,
        msg: "The user is not administrator",
      });
    }
  } else {
    return res.status(500).json({
      ok: false,
      msg: "There is no user established",
    });
  }

  next();
};

module.exports = {
  isAdminRole,
};
