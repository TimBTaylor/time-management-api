const db = require("../db");
const express = require("express");
const router = express.Router();

// delete new job
router.post("/new-job", (req, res) => {
  const company_number = req.body.company_number;
  const job_name = req.body.job_name;
  const job_po = req.body.job_po;
  const job_for = req.body.job_for;
  const comments = req.body.comments;
  db.query(
    "INSERT INTO Jobs (job_name, job_po, job_for, comments, company_number) VALUES (?, ?, ?, ?, ?)",
    [job_name, job_po, job_for, comments, company_number],
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(201).json("Job created");
      }
    }
  );
});

// delete job
router.delete("/delete-job", (req, res) => {
  const job_name = req.body.job_name;
  const job_po = req.body.job_po;
  db.query(
    `DELETE FROM Jobs WHERE job_name = "${job_name}" AND job_po = "${job_po}"`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json("Job deleted");
      }
    }
  );
});

module.exports = router;
