require("dotenv").config();
const mysql = require("mysql");

var db_config = {
  host: process.env.DATABASE_HOSTNAME,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const db = mysql.createPool(db_config);

db.getConnection((err) => {
  if (err) {
    console.log(err);
    reconnect(db);
    return;
  } else {
    console.log("database connected");
  }
});

module.exports = db;
