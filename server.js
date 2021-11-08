require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/users");
const companyRouter = require("./routes/company");
const jobRouter = require("./routes/jobs");
const timeRouter = require("./routes/time");
const cors = require("cors");
require("./auth");

const app = express();

app.use(express.json());

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "*",
    methods: ["GET, POST, DELETE, PUT"],
  })
);

app.use("/user", userRouter);

app.use("/company", companyRouter);

app.use("/jobs", jobRouter);

app.use("/time", timeRouter);

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with google</a>');
});

app.get("/healthcheck", (req, res) => {
  return res.status(200);
});

// user sign in and or create employee account
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//create admin account
app.get(
  "/auth/google/admin",
  passport.authenticate("google-create-admin", { scope: ["email", "profile"] })
);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

module.exports = app;
