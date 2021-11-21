const db = require("../db");
const express = require("express");
const { route } = require("./time");
const router = express.Router();

// create new job
router.post("/new-job", (req, res) => {
  const companyNumber = req.body.companyNumber;
  const jobName = req.body.jobName;
  const jobPo = req.body.jobPo;
  const jobFor = req.body.jobFor;
  const comments = req.body.comments;
  db.query(
    "INSERT INTO Jobs (job_name, job_po, job_for, comments, company_number) VALUES (?, ?, ?, ?, ?)",
    [jobName, jobPo, jobFor, comments, companyNumber],
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
  const jobName = req.body.jobName;
  const jobPo = req.body.jobPo;
  db.query(
    `DELETE FROM Jobs WHERE job_name = "${jobName}" AND job_po = "${jobPo}"`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json("Job deleted");
      }
    }
  );
});

//get all jobs for a company
router.post("/all-company-jobs", (req, res) => {
  const companyNumber = req.body.companyNumber;
  db.query(
    `SELECT * FROM Jobs WHERE company_number = ${companyNumber}`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
