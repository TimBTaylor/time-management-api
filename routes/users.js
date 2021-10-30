const db = require("../db");
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/protected", isLoggedIn, (req, res) => {
  if (req.user) {
    db.query("SELECT * FROM Admins", (err, result) => {
      result.map((user) => {
        if (user.email === req.user._json.email) {
          res.send(user);
        }
      });
    });
  }
});

module.exports = router;
