const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJWT = async (user) => {
  const { _id: uid } = user;

  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid },
      process.env.SECRET_KEY_JWT,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generateJWT };
