const db = require("../db");
const express = require("express");
const router = express.Router();

// new time entry
router.post("/new-time-entry", (req, res) => {
  const adminId = req.body.adminId;
  const userId = req.body.userId;
  const jobName = req.body.jobName;
  const hours = req.body.hours;
  const minutes = req.body.minutes;
  const notes = req.body.notes;
  const companyNumber = req.body.companyNumber;
  const date = req.body.date;
  db.query(
    `INSERT INTO Time_Entries (admin_id, user_id, job_name, hours, minutes, notes, date, company_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [adminId, userId, jobName, hours, minutes, notes, date, companyNumber],
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
  const timeEntryId = req.body.timeEntryId;
  const id = req.body.userID;
  const typeOfId = req.body.typeOfId;
  const jobName = req.body.jobName;
  const date = req.body.date;
  db.query(
    `DELETE FROM Time_Entries WHERE ${typeOfId} = ${id} AND job_name = "${jobName}" AND date = "${date}" AND id = ${timeEntryId}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        if (result.affectedRows == 1) {
          return res.status(200).json("Request successful");
        } else {
          return res.status(500).json("Request unsuccessful");
        }
      }
    }
  );
});

// all time entrys for a user
router.get("/:id/:typeOfId/all-time-entries-user", (req, res) => {
  // the userID in this request can be an employee's or admin's
  const id = req.params.id;
  const typeOfId = req.params.typeOfId;
  db.query(
    `SELECT * FROM Time_Entries WHERE ${typeOfId} = ${id}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

// all time entrys for a company
router.get("/:companyNumber/all-time-entries-company", (req, res) => {
  const companyNumber = req.params.companyNumber;
  db.query(
    `SELECT t.date, t.job_name, t.hours, t.minutes, t.notes, t.id as time_entry_id, e.first_name, e.last_name
    FROM Time_Entries as t
    INNER JOIN Employees AS e ON t.user_id = e.id
    WHERE e.company_number = ${companyNumber}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        let simplifiedTimeEntries = [];
        result.map((entry) => {
          // if entry it by an employee
          if (entry.employee_first_name !== null) {
            simplifiedTimeEntries.push({
              jobName: entry.job_name,
              hours: entry.hours,
              minutes: entry.minutes,
              notes: entry.notes,
              date: entry.date,
              fistName: entry.employee_first_name,
              lastName: entry.employee_last_name,
            });
          } else {
            simplifiedTimeEntries.push({
              jobName: entry.job_name,
              hours: entry.hours,
              notes: entry.notes,
              minutes: entry.minutes,
              date: entry.date,
              fistName: entry.admin_first_name,
              lastName: entry.admin_last_name,
            });
          }
          return entry;
        });
        console.log(result);
        return res.status(200).json(result);
      }
    }
  );
});

//weekly time entries
router.post("/weekly-time", (req, res) => {
  let curr = new Date();
  let week = [];

  for (let i = 0; i <= 6; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    week.push(day);
  }
  const id = req.body.userID;
  const typeOfId = req.body.typeOfId;
  let filterdTimeEntries = [];
  db.query(
    `SELECT * FROM Time_Entries WHERE ${typeOfId} = ${id}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        week.map((date) => {
          result.map((entry) => {
            if (entry.date === date) {
              filterdTimeEntries.push(entry);
            }
          });
        });
        return res.status(200).json(filterdTimeEntries);
      }
    }
  );
});

module.exports = router;
