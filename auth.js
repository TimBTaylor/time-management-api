require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//  sign in
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "322422677461-6nlclaik5vcgvhu8l4eb2oik99jm4a8c.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// employee create account
passport.use(
  "google-create-employee",
  new GoogleStrategy(
    {
      clientID:
        "322422677461-9il4rhhv5b1vrvinuheeivok64l14rcg.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/google/callback/create-employee",
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
      clientID:
        "322422677461-pf3q7g6ogdk5ia3ns7ss999vkrmss4sl.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/google/callback/create-admin",
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
