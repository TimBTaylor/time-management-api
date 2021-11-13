require("dotenv").config();
const mysql = require("mysql");

var db_config = {
  host: process.env.DATABASE_HOSTNAME,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const db = mysql.createConnection(db_config);

db.connect((err) => {
  if (err) {
    console.log(err);
    db = reconnect(db);
    return;
  } else {
    console.log("database connected");
  }
});

function reconnect(db) {
  if (db) db.end();
  var connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      setTimeout(reconnect, 2000);
    } else {
      return db;
    }
  });
}

//- Error listener
db.on("error", function (err) {
  //- The server close the connection.
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    db = reconnect(db);
  }

  //- Connection in closing
  else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    db = reconnect(db);
  }

  //- Fatal error : connection variable must be recreated
  else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    db = reconnect(db);
  }

  //- Error because a connection is already being established
  else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
  }

  //- Anything else
  else {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    db = reconnect(db);
  }
});
module.exports = db;
