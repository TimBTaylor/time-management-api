require("dotenv").config();
const mysql = require("mysql");

var db_config = {
  connectionLimit: 100000,
  connectTimeout: 60 * 60 * 100000,
  acquireTimeout: 60 * 60 * 100000,
  timeout: 60 * 60 * 100000,
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
    return;
  } else {
    console.log("database connected");
  }
});

module.exports = db;
