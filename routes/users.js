const db = require("../db");
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const passport = require("passport");

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "auth/failure",
  }),
  isLoggedIn,
  function (req, res) {
    // retieves admins from database
    db.query("SELECT * FROM Admins", (err, result) => {
      if (err) {
        return res.json(err);
      }
      // fitlers admin to find current admin
      let admin = result.filter((admin) => {
        return admin.email === req.user._json.email;
      });
      if (admin) {
        console.log(admin);
        console.log("Admin found login");
        return res.json(admin);
      }
    });
    // retrieves employees from database
    db.query("SELECT * FROM Employees", (err, result) => {
      if (err) {
        return res.json(err);
      }
      // filters employees for find current employee
      let employee = result.filter((employee) => {
        console.log(employee);
        console.log("Employee found login");
        return employee.email === req.user._json.email;
      });
      if (employee) {
        // returns the existing employee
        return res.json(employee[0]);
      } else {
        // inserts new employee
        db.query(
          "INSERT INTO Employees (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, ?, CURDATE(), ?)",
          [
            result.name.familyName,
            result.name.givenName,
            result._json.email,
            0,
            result._json.picture,
          ],
          (err, result) => {
            if (err) {
              return res.json(err);
            } else {
              console.log(result);
              console.log("Employee account created");
              return res.json(result);
            }
          }
        );
      }
    });
  }
);

module.exports = router;
