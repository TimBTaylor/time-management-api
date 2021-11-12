require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

//  sign in and or create employee account
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/employee/home",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// create admin account
passport.use(
  "google-create-admin",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_ADMIN,
      clientSecret: process.env.GOOGLE_CLEINT_SECRET_ADMIN,
      callbackURL: "http://localhost:3001/user/google/callback/create-admin",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
