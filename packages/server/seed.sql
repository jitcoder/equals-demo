DROP TABLE IF EXISTS Employees;

CREATE TABLE Employees (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   first_name text NOT NULL,
   last_name text NOT NULL,
   salary decimal(10,2) NOT NULL,
   email text NOT NULL
);


INSERT INTO Employees (first_name, last_name, salary, email) VALUES('Bob', 'Bobby', 50000, 'bob@company.com');
INSERT INTO Employees (first_name, last_name, salary, email) VALUES('Sally', 'Smith', 75000, 'sally@company.com');
INSERT INTO Employees (first_name, last_name, salary, email) VALUES('Bossman', 'RunsCompany', 100000.56, 'bossman@company.com');
INSERT INTO Employees (first_name, last_name, salary, email) VALUES('Joe', 'Santana', 55000, 'joe@company.com');
