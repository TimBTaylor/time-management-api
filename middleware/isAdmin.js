const db = require("../db");

module.exports = (req, res, next) => {
  let admin = db.query("SELECT * FROM Admins", (err, result) => {
    let user = false;
    result.map((admin) => {
      console.log(admin.email);
      console.log(req.user._json.email);
      if (admin.email === req.user._json.email) {
        user = true;
      }
    });
    return user;
  });

  console.log(admin);
  res.admin = admin;
  next();
};
