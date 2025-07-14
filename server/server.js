const express = require("express");
const cors = require("cors");
const app = express();
const uploadRoute = require("./routes/upload");
const dataRoute = require("./routes/data");
const path = require("path");
const XLSX = require("xlsx");
const db = require("./db");

app.use(cors());
app.use(express.json());
app.use("/upload", uploadRoute);
app.use("/data", dataRoute);

// ✅ Create table if it doesn't exist and load data if empty
function ensureEmployeesTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      s_no INT,
      employee_name VARCHAR(255),
      staff_no VARCHAR(20) PRIMARY KEY,
      designation VARCHAR(100),
      parent VARCHAR(20),
      email VARCHAR(255),
      phone VARCHAR(20),
      department VARCHAR(100),
      joining_date DATE,
      project1 VARCHAR(100),
      role1 VARCHAR(10),
      project2 VARCHAR(100),
      role2 VARCHAR(10),
      project3 VARCHAR(100),
      role3 VARCHAR(10)
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Failed to create table:", err);
      return;
    }

    console.log("✅ Table checked/created");

    // 🔍 Check if table is empty
    db.query("SELECT COUNT(*) as count FROM employees", (err, results) => {
      if (err) return console.error(err);

      if (results[0].count === 0) {
        console.log("📥 No data found. Loading default Excel...");
        loadDefaultExcel();
      } else {
        console.log("📊 Table already contains data.");
      }
    });
  });
}

// 📥 Load Default Excel File to DB
function loadDefaultExcel() {
  const filePath = path.join(__dirname, "default", "Employee_details.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

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

  const insertQuery = `
    INSERT INTO employees (
      s_no, employee_name, staff_no, designation, parent,
      email, phone, department, joining_date,
      project1, role1, project2, role2, project3, role3
    ) VALUES ?`;

  db.query(insertQuery, [values], (err) => {
    if (err) console.error("❌ Default Excel load failed:", err);
    else console.log("✅ Default Excel loaded into MySQL");
  });
}

// ✅ Start Server
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running at http://0.0.0.0:3000");
  ensureEmployeesTableExists();  // 🛠️ Auto-setup MySQL
});
