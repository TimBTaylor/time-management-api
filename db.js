const mysql = require("mysql");

const db = mysql.createConnection({
  host: "timemanagement.cf3y6mmaym1u.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "Ylugi384",
  database: "my_time_management",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("database connected");
  }
});

module.exports = db;
