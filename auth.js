require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
