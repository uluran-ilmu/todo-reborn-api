const express = require("express");
const ENV = require("./env");
const authRouter = require("./auth");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ENV.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT ${ENV.PORT}`);
});

app.use("/auth", authRouter);
