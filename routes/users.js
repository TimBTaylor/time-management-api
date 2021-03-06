const db = require("../db");
const express = require("express");
const { response } = require("express");
const router = express.Router();

// user sign in and employee create account
router.post("/auth/login", async (req, res) => {
  // retieves current user from database
  try {
    await db.query(
      `SELECT * FROM Admins WHERE email = "${req.body.email}" UNION ALL SELECT * FROM Employees WHERE email = "${req.body.email}"`,
      (err, result) => {
        if (err) {
          // return error from database request
          return res.status(500).json(err.sqlMessage);
        } else {
          if (result.length > 0) {
            //returning the current user
            return res.status(200).json(result[0]);
          } else {
            const todayDate = new Date().toISOString().slice(0, 10);
            // inserts new employee
            db.query(
              "INSERT INTO Employees (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, 0, ?, ?)",
              [
                req.body.givenName,
                req.body.familyName,
                req.body.email,
                todayDate,
                req.body.picture,
              ],
              (err, result) => {
                if (err) {
                  // return error from database request
                  return res.status(500).json(err.sqlMessage);
                } else {
                  if (result.affectedRows == 1) {
                    db.query(
                      `SELECT * FROM Employees WHERE email = "${req.body.email}"`,
                      (err, result) => {
                        if (err) {
                          return res.status(500).json(err.sqlMessage);
                        } else {
                          return res.status(201).json(result[0]);
                        }
                      }
                    );
                  } else {
                    return res.status(400).json("Employee not created");
                  }
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    return res.json(error);
  }
});

// create admin account
router.post("/auth/create-admin", (req, res) => {
  // retrieves users from admins and employee table where email is the current users email
  db.query(
    `SELECT * FROM Admins WHERE email = "${req.body.email}" UNION ALL SELECT * FROM Employees WHERE email = "${req.body.email}"`,
    (err, result) => {
      if (err) {
        res.status(500).json(err.sqlMessage);
      } else {
        let isUser = false;
        let isAdmin = false;
        let email;
        if (result.length > 0) {
          isUser = true;
          email = req.body.email;
          if (result[0].is_admin === 1) {
            isAdmin = true;
          }
        }
        // checks if current email is already registered
        if (isUser) {
          console.log(result[0]);
          return res.status(200).json(result[0]);
        } else {
          const todayDate = new Date().toISOString().slice(0, 10);
          // inserts new users information into Admins database
          db.query(
            "INSERT INTO Admins (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, 1, ?, ?)",
            [
              req.body.givenName,
              req.body.familyName,
              req.body.email,
              todayDate,
              req.body.picture,
            ],
            (err, result) => {
              if (err) {
                return res.status(500).json(err.sqlMessage);
              } else {
                if (result.affectedRows == 1) {
                  db.query(
                    `SELECT * FROM Admins WHERE email = "${req.body.email}"`,
                    (err, result) => {
                      if (err) {
                        return res.status(500).json(err.sqlMessage);
                      } else {
                        return res.status(201).json(result[0]);
                      }
                    }
                  );
                } else {
                  return res.status(400).json("Admin not created");
                }
              }
            }
          );
        }
      }
    }
  );
});

//update user company
router.put("/update-company", (req, res) => {
  const email = req.body.email;
  const newCompanyNumber = req.body.newCompanyNumber;
  const tableName = req.body.tableName;
  // retrieves the company that matches the new company number
  db.query(
    `SELECT * FROM Companies WHERE company_number = ${newCompanyNumber}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        if (result.length > 0) {
          let companyInfo = {
            companyNumber: result[0].company_number,
            companyName: result[0].company_name,
          };
          // if a valid company then updates users company
          db.query(
            `UPDATE ${tableName} SET company_number = ${newCompanyNumber} WHERE email = "${email}"`,
            (err, result) => {
              if (err) {
                return res.status(500).json(err.sqlMessage);
              } else {
                return res.status(200).json(companyInfo);
              }
            }
          );
        } else {
          return res.status(400).json("Not a company");
        }
      }
    }
  );
});

// update admin status
router.put("/update-admin-status", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const date = req.body.date;
  const profileImage = req.body.profileImage;
  const companyNumber = req.body.companyNumber;
  db.query(`DELETE FROM Employees WHERE email = "${email}"`, (err, result) => {
    if (err) {
      return res.status(500).json(err.sqlMessage);
    } else {
      if (result.affectedRows == 1) {
        db.query(
          `INSERT INTO Admins (first_name, last_name, email, is_admin, date, profile_image, company_number) VALUES (?, ?, ?, 1, ?, ?, ?)`,
          [firstName, lastName, email, date, profileImage, companyNumber],
          (err, result) => {
            if (err) {
              return res.status(500).json(err.sqlMessage);
            } else {
              return res
                .status(201)
                .json(`${firstName} ${lastName} is now an Admin`);
            }
          }
        );
      } else {
        return res.status(400).json("Not valid email");
      }
    }
  });
});

//delete account
router.delete("/delete-account", async (req, res) => {
  const email = req.body.email;
  const accountType = req.body.accountType;
  await db.query(
    `DELETE FROM ${accountType} WHERE email = "${email}"`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json(`${email} deleted`);
      }
    }
  );
});

//logout of account
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
});

module.exports = router;
