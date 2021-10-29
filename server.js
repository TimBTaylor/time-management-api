require("dotenv").config();

const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/users");
const cors = require("cors");
const googleLogIn = require("./");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

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

const db = mysql.createConnection({
  host: "timemanagement.cf3y6mmaym1u.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "Ylugi384",
  database: "my_time_management",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("database connected");
  }
});

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send("Hello" + req.user.name.givenName);
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
});

app.get("/random", isLoggedIn, (req, res) => {
  res.send(req.user.displayName);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
