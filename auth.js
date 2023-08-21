const express = require("express");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // simpen ke database

  res.status(200).json({
    message: "User has been registered successfully",
  });
};

const router = express.Router();

router.post("/register", register);

module.exports = router;
