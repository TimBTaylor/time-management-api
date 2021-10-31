const db = require("../db");

module.exports = (req, res, next) => {
  db.query("SELECT * FROM Admins", (err, result) => {});
};
