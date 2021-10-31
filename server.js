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
  res.send('<a href="/auth/google">Authenticate with google</a>');
});

// user sign in and or create employee account
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//create admin account
app.post(
  "/auth/google/admin",
  passport.authenticate("google-create-admin", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "auth/failure",
  }),
  isLoggedIn,
  function (req, res) {
    // retieves admins from database
    db.query("SELECT * FROM Admins", (err, result) => {
      if (err) {
        // return error from database request
        return res.json(err);
      } else {
        // fitlers admin to find current admin
        let admin = result.filter((admin) => {
          return admin.email === req.user._json.email;
        });
        if (admin.length > 0) {
          return res.json(admin);
        } else {
          // retrieves employees from database
          let allEmployees = [];
          db.query("SELECT * FROM Employees", (err, result) => {
            allEmployees = result;
            if (err) {
              // return error from database request
              return res.json(err);
            } else {
              // filters employees for find current employee
              let employee = result.filter((employee) => {
                return employee.email === req.user._json.email;
              });
              if (employee.length > 0) {
                // returns the existing employee
                return res.json(employee[0]);
              } else {
                // inserts new employee
                db.query(
                  "INSERT INTO Employees (first_name, last_name, email, is_admin, date, profile_image) VALUES (?, ?, ?, ?, CURDATE(), ?)",
                  [
                    req.user.name.familyName,
                    req.user.name.givenName,
                    req.user._json.email,
                    0,
                    req.user._json.picture,
                  ],
                  (err, result) => {
                    if (err) {
                      // return error from database request
                      return res.json(err);
                    } else {
                      // retrieves all employees including new employee
                      db.query("SELECT * FROM Employees", (err, result) => {
                        if (err) {
                          // return error from database request
                          return res.json(err);
                        } else {
                          // filters employees to find current employee
                          let employee = result.filter((employee) => {
                            return employee.email === req.user._json.email;
                          });
                          return res.json(employee[0]);
                        }
                      });
                    }
                  }
                );
              }
            }
          });
        }
      }
    });
  }
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
