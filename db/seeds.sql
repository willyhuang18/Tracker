INSERT INTO department (name)
VALUES  ("IT"),
        ("Marketing"),
        ("Human Resource"),
        ("Finance"),
        ("Operation Management");

INSERT INTO role (title, salary, department_id)
VALUES  ("Software Engineer",120000 , 1),
        ("Human Resources Manager",10000 , 3),
        ("Accountant",100000 ,4 ),
        ("Data Analyst",90000 , 1),
        ("Financial Analyst",130000 , 4),
        ("Operating Officer",70000 ,5 ),
        ("Marketing Manager",70000 , 2),
        ("Product manager", 10000, 2),
        ("Human resource personnel",50000 , 3),
        ("Customer service representative", 50000,2 );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Jackson', 'Wang', 1, 1),
        ('Draven', 'Miller', 9, null),
        ('Graves', 'Ashe', 4, null),
        ('Omen', 'Devin', 3, 3),
        ('Lux', 'LeBlanc', 6, null),
        ('Akali', 'Akshan', 5, 5),
        ('Bard', 'Sol', 7, null),
        ('Cho', 'Gath', 8, 6),
        ('Mundo', 'Lewis', 2, 8),
        ('Ezreal', 'Fizz', 10, 7);