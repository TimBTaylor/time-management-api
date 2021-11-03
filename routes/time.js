const db = require("../db");
const express = require("express");
const { route } = require("./users");
const router = express.Router();

// new time entry
router.post("/new-time-entry", (req, res) => {
  const admin_id = req.body.admin_id;
  const user_id = req.body.user_id;
  const job_name = req.body.job_name;
  const hours = req.body.hours;
  const notes = req.body.notes;
  const company_number = req.body.company_number;
  db.query(
    `INSERT INTO Time_Entries (admin_id, user_id, job_name, hours, notes, date, company_number) VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
    [admin_id, user_id, job_name, hours, notes, company_number],
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(201).json("Time added");
      }
    }
  );
});

// delete time entry
router.delete("/delete-time-entry", (req, res) => {
  // the users id in this request can be an employee's or admin's
  const id = req.body.userID;
  const typeOfId = req.body.typeOfId;
  const job_name = req.body.job_name;
  const date = req.body.date;
  db.query(
    `SELECT * FROM Time_Entries WHERE ${typeOfId} = ${id} AND job_name = "${job_name}" AND date = ${date}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.json(result);
      }
    }
  );
});

// update time entry
router.put("/update-time-entry", (req, res) => {
  const id = req.body.userID;
  const typeOfId = req.body.typeOfId;
  const job_name = req.body.job_name;
  const date = req.body.date;
  const hours = req.body.hours;
  const notes = req.body.notes;
  db.query();
});

// all time entrys for a user

// all time entrys for a company

module.exports = router;
