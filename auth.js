const express = require("express");
const { Op } = require("sequelize");
const { User } = require("./models");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const cookie = require("cookie");
const bcrypt = require("bcrypt");
const ENV = require("./env");

const authorizeMiddleware = async (req, res, next) => {
  const { LoginToken: tokenJwt } = cookie.parse(req.headers.cookie || "");

  if (!tokenJwt) {
    res.status(401).json({
      message: "Your session has expired. Please login.",
    });
  } else {
    await jwt.verify(tokenJwt, ENV.JWT_SECRET, (error, decodedResult) => {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        res.status(401).json({
          message: "Your session has expired. Please login.",
        });
      }

      req.body = { ...req.body, user: { ...decodedResult } };
      next();
    });
  }
};

const getAuthUserHandler = async (req, res) => {
  const { user } = req.body;
  res.status(200).json({
    data: user,
  });
};

const registerHandler = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(ENV.PASSWORD_HASH_SALT)
    );

    const users = await User.findAll({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (users.length > 0) {
      return res.status(400).json({
        email: "Email has exist inside the system",
      });
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...restUser } = user.dataValues;

      const tokenJwt = jwt.sign(
        {
          user: restUser,
        },
        ENV.JWT_SECRET
      );

      const cookieJwt = cookie.serialize("LoginToken", tokenJwt, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookieJwt);

      res.status(200).json({
        user: restUser,
        token: tokenJwt,
      });
    } else {
      res.status(401).json({
        email: "Email or password is incorrect",
        password: "Email or password is incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const logoutHandler = (req, res) => {
  const deathCookie = cookie.serialize("LoginToken", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.setHeader("Set-Cookie", deathCookie);

  res.status(200).json({
    message: "Cookie has been cleared",
  });
};

const router = express.Router();

router.get("/", authorizeMiddleware, getAuthUserHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/logout", logoutHandler);

module.exports = router;
