const db = require("../db");
const express = require("express");
const router = express.Router();

// add company request
router.post("/new-company", (req, res) => {
  const companyName = req.body.companyName;
  const adminEmail = req.body.adminEmail;
  const companyNumber = req.body.companyNumber;
  const todayDate = new Date().toISOString().slice(0, 10);
  db.query(
    "INSERT INTO Companies (company_name, date, admin_email, company_number) VALUES (?, ?, ?, ?)",
    [companyName, adminEmail, todayDate, companyNumber],
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(201).json("Company created");
      }
    }
  );
});

// update company name
router.put("/new-name", (req, res) => {
  const newCompanyName = req.body.newCompanyName;
  const adminEmail = req.body.adminEmail;
  db.query(
    `UPDATE Companies SET company_name = "${newCompanyName}" WHERE admin_email = "${adminEmail}"`,
    (err, result) => {
      if (err) {
        return res.status(500).json(err.sqlMessage);
      } else {
        return res.status(200).json("Company updated");
      }
    }
  );
});

module.exports = router;
