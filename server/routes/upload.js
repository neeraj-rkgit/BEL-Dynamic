const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const db = require("../db");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const insertQuery = `
    INSERT INTO employees (
      s_no, employee_name, staff_no, designation, parent,
      email, phone, department, joining_date,
      project1, role1, project2, role2, project3, role3
    ) VALUES ?`;

  const values = data.map(emp => [
    emp.s_no || null,
    emp.employee_name || null,
    emp.staff_no || null,
    emp.designation || null,
    emp.parent || null,
    emp.email || null,
    emp.phone || null,
    emp.department || null,
    emp.joining_date ? new Date(emp.joining_date) : null,
    emp.project1 || null,
    emp.role1 || null,
    emp.project2 || null,
    emp.role2 || null,
    emp.project3 || null,
    emp.role3 || null
  ]);

  db.query("DELETE FROM employees", () => {
    db.query(insertQuery, [values], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Upload successful" });
    });
  });
});

module.exports = router;
