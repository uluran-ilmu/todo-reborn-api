const express = require("express");
const ENV = require("./env");
const authRouter = require("./auth");

const app = express();

app.use(express.json());

app.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT ${ENV.PORT}`);
});

app.use("/auth", authRouter);
