require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOSTNAME,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
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
