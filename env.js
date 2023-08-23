require("dotenv").config();

const ENV = {
  PORT: process.env.PORT,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
};

module.exports = ENV;
