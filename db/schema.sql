DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id  INT,
    -- using Index
    -- Indexes are special lookup tables that the database search engine 
    -- can use to speed up data retrieval.
    INDEX department_index(department_id),
    -- using Constraint
    -- Constraints are the rules enforced on the data columns of a table.
    CONSTRAINT con_department 
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    INDEX role_index(role_id),
    CONSTRAINT con_role 
    FOREIGN KEY(role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    manager_id INT
    INDEX manager_index (manager_id),
    CONSTRAINT con_manager 
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id) 
    ON DELETE SET NULL
);