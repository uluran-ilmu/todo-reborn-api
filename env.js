require("dotenv").config();

const ENV = {
  PORT: process.env.PORT,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  PASSWORD_HASH_SALT: parseInt(process.env.PASSWORD_HASH_SALT),
  PASSWORD_HASH_SECRET: process.env.PASSWORD_HASH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = ENV;
