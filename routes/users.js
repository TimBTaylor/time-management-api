const db = require("../db");
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const passport = require("passport");

// user sign in and employee create account
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "auth/failure",
  }),
  isLoggedIn,
  function (req, res) {
    // retieves current user from database
    db.query(
      `SELECT * FROM Admins WHERE email = "${req.user._json.email}" UNION ALL SELECT * FROM Employees WHERE email = "${req.user._json.email}"`,
      (err, result) => {
        if (err) {
          // return error from database request
          return res.status(500).json({ message: err });
        } else {
          if (result.length > 0) {
            //returning the current user
            return res.json(result[0]);
          } else {
            // inserts new employee
            db.query(
              "INSERT INTO Employees (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, 0, CURDATE(), ?)",
              [
                req.user.name.familyName,
                req.user.name.givenName,
                req.user._json.email,
                req.user._json.picture,
              ],
              (err, result) => {
                if (err) {
                  // return error from database request
                  return res.status(500).json({ message: err });
                } else {
                  // retrieves all employees including new employee
                  db.query(
                    `SELECT * FROM Employees WHERE email = "${req.user._json.email}"`,
                    (err, result) => {
                      if (err) {
                        // return error from database request
                        return res.status(500).json({ message: err });
                      } else {
                        if (result.length > 0) {
                          return res.json(result[0]);
                        }
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
);

// create admin account
router.get(
  "/google/callback/create-admin",
  passport.authenticate("google-create-admin", {
    failureRedirect: "auth/failure",
  }),
  (req, res) => {
    // retrieves users from admins and employee table where email is the current users email
    db.query(
      `SELECT * FROM Admins WHERE email = "${req.user._json.email}" UNION ALL SELECT * FROM Employees WHERE email = "${req.user._json.email}"`,
      (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          let isUser = false;
          let isAdmin = false;
          let email;
          if (result.length > 0) {
            isUser = true;
            email = req.user._json.email;
            if (result[0].is_admin === 1) {
              isAdmin = true;
            }
          }
          // checks if current email is already registered
          if (isUser) {
            return res.json({ isUser, isAdmin, email });
          } else {
            // inserts new users information into Admins database
            db.query(
              "INSERT INTO Admins (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, 1, CURDATE(), ?)",
              [
                req.user.name.familyName,
                req.user.name.givenName,
                req.user._json.email,
                req.user._json.picture,
              ],
              (err, result) => {
                if (err) {
                  return res.status(500).json({ message: err });
                } else {
                  // retrieves the newly added admin information
                  db.query(
                    `SELECT * FROM Admins WHERE email = "${req.user._json.email}"`,
                    (err, result) => {
                      if (err) {
                        return res.status(500).json({ message: err });
                      } else {
                        return res.json(result[0]);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
);

//update user company
router.put("/update-company", (req, res) => {
  const email = req.body.email;
  const newCompanyNumber = req.body.newCompanyNumber;
  const tableName = req.body.tableName;
  // retrieves the company that matches the new company number
  db.query(
    `SELECT * FROM Companies WHERE company_number = ${newCompanyNumber}`,
    (err, result) => {
      console.log(result);
      console.log("result from new company");
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        if (result.length > 0) {
          // if a valid company then updates users company
          db.query(
            `UPDATE ${tableName} SET company_number = ${newCompanyNumber} WHERE email = "${email}"`,
            (err, result) => {
              if (err) {
                return res.status(500).json({ message: err });
              } else {
                return res.json("Users company updated");
              }
            }
          );
        } else {
          return res.json("Not a company");
        }
      }
    }
  );
});

// update admin status
router.put("/update-admin-status", (req, res) => {});

module.exports = router;
