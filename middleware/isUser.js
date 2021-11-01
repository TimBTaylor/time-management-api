const db = require("../db");

module.exports = (req, res, next) => {
  let employee = false;
  try {
    // retrieves employees from database
    db.query("SELECT * FROM Employees", (err, result) => {
      if (err) {
        return res.status(500).json({ message: error.message });
      } else {
        // finds employee to match current user
        result.map((employee) => {
          if (employee.email === res.user._json.email) {
            employee = true;
          }
          return employee;
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.employee = employee;
  next();
};
