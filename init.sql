CREATE DATABASE org_tree;
USE org_tree;

CREATE TABLE employees (id INT AUTO_INCREMENT PRIMARY KEY, s_no VARCHAR(10), employee_name VARCHAR(255), staff_no VARCHAR(20), designation VARCHAR(100), parent VARCHAR(20), email VARCHAR(100), phone VARCHAR(20), department VARCHAR(100), joining_date DATE, project1 VARCHAR(100), role1 VARCHAR(100), project2 VARCHAR(100), role2 VARCHAR(100), project3 VARCHAR(100), role3 VARCHAR(100));

-- CREATE TABLE IF NOT EXISTS employees (
-- )