require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/users");
const cors = require("cors");
const db = require("./db");
require("./auth");

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

app.get("/", (req, res) => {
  res.send('<a href="/auth/google/admin">Authenticate with google</a>');
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

app.get(
  "/google/callback/create-admin",
  passport.authenticate("google-create-admin", {
    successRedirect: "/user/admin-created",
    failureRedirect: "auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send("Hello" + req.user.name.givenName);
  console.log(req.user);
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
