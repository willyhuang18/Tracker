// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 
// import console.table
const table  = require('console.table');
//import style 
const figlet = require('figlet');

//connect to the database
const db = mysql.createConnection({
    host:'localhost',
    user: 'root', 
    password: 'password',
    database: 'company_db'
},
console.log(`Connected to the company_db database.`)
);

//check any connection err to the sql 
db.connect(err => {
    if(err){
        throw err;
    }
    console.log(db.threadId);
    employeePrompt();
})


//welcome image
console.log(figlet.textSync(`WELCOME TO    THE COMPANY`, {
    font: 'Standard',
    horizontalLayout: 'fitted',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}));

//adding prompt for the user
const employeePrompt = () =>{
    inquirer.prompt([{
        type: 'list',
        name:'choices',
        message: ' Please select at least one below: ',
        choices:['View All Employees',
                 'Add Employee',
                 'Update Employee Role',
                 'View All Roles',
                 'Add Role',
                 'View All Departments',
                 'Add Department',
                 'No Further Action for the company'
            ]
    }])
    //give a switch method for the response
    .then(response=>{
        const {choices} = response;
        switch (choices){
            case 'View All Employees':
                viewEmployee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                viewAllRole();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartment();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'No Further Action for the company':
                db.end();
            default:
                console.log('Please enter one position');
        }
    });
}

//View All Employee function
const viewEmployee = () => {
    console.log('All Employee below:');
    const sql = `SELECT employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department,
        role.salary, 
        CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager 
        ON employee.manager_id = manager.id
        `;
    //using promise method and  Query database
    db.promise().query(sql) 
    .then( ([rows,fields]) => {
        console.table(rows);
      })
      .catch(console.log)
      employeePrompt();
}
//view add employee
const addEmployee = () => {
    //insert the role from role table
    const role = `SELECT role.id, role.title FROM role`;
    db.query(role, (err, data) => {
        if(err){
            console.log(err);
        }
        const roleId = data.map(({id, title}) => (
            {name: title, value: id}
        ));
        console.log(roleId);

    const manager = `SELECT * FROM employee`;
    db.query(manager, (err, data)=>{
        if(err){
            console.log(err);
            }
        const managerId = data.map(({id, first_name, last_name}) => 
            ({
             name: first_name + last_name, value: id
            }));
            console.log(managerId);

    inquirer.prompt([{
      type:'input',
      name:'firstName',
      message:'What is the your First name?',  
    },
    {
        type:'input',
        name:'lastName',
        message:'What is the your Last name?', 
    },{
        type: 'list',
        name: 'role',
        message: "What is the position the employee applying?",
        choices: roleId
    },{
        type: 'list',
        name: 'manager',
        message: "Which manager you want to assign to?",
        choices: managerId
    }
    ])
    .then(choices =>{
        const input = [choices.firstName, choices.lastName]
        const roles = choices.role;
        input.push(roles);
        const managers = choices.manager;
        input.push(managers);
        const employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
        db.query(employeeSql, input, (err, result)=>{
            if(err){console.log(err);}
            console.log("Employee Added");
             //execute the employee function
            viewEmployee();
                        })
            })
            .catch(err => console.log(err))
        })
    })
}      


//Update Employee Role function
const updateEmployee = ()=> {
    //getting data from employee table
    const employee = `SELECT * FROM employee`;
    //using sql query to get the data frm sql file
    db.query(employee, (err, data) => {
        if(err){
            console.log(err);
        }
        const employeeId = data.map(({ id, first_name, last_name }) => (
            { 
                name: first_name + last_name, value: id 
            }
        ));
        console.log(employeeId);
        //getting data from employee table
        const role = `SELECT * FROM role`;
        db.query(role, (err, data) => {
            if(err){
                console.log(err);
            }
            const roleId = data.map(({ id, title }) => (
                { 
                name: title, value: id 
                }
            ));
            console.log(roleId);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',   
                    message: "Who would you like to promotion with?",
                    choices: employeeId
                },{
                    type: 'list',
                    name: 'role',
                    message: "What is the position after promotion?",
                    choices: roleId  
                }
            ])
            //then callback function
            .then(choice => {
                const employees = choice.name;
                const input = [];
                input.push(employees);
                const roles = choice.role;
                input.push(roles)
                console.log(input);
                const employeeSql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(employeeSql, (err, res)=>{
                    if(err){
                        console.log(err);
                        }
                    console.log('Employee had promo');
                    viewEmployee();
                    })
            })  
        })
    })
}

//view all Roles function
const viewAllRole = () =>{
    console.log('please view the position below:');
    //getting data from role table
    const roleSql = `
    SELECT role.id, role.title, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id
    `;
    db.promise().query(roleSql) 
    .then( ([rows,fields]) => {
        console.table(rows);
      })
      .catch(console.log)
      employeePrompt();
}

//add role function 
const addRole = () =>{
    inquirer.prompt([
        {
         type: 'input', 
         name: 'role',
         message: "Please enter the position you would like to add?",
        },
        {
        type: 'input', 
        name: 'salary',
        message: "Please enter the salary you want for this position?",
        }
    ])
    .then( response => {
        const money = [response.role, response.salary];

        //getting data from department table
        const depSql = `SELECT name, id FROM department`; 

        db.promise().query(depSql, (err, data) => {
            if(err){
                console.log(err);
            }
            //map the input from user
            const department = data.map(({name, id}) => (
                    {
                        name: name, value: id
                    }
                ));
            inquirer.prompt([
                {
                    type: 'input', 
                    name: 'department',
                    message: "Please enter the department that this position belong to",
                    choice: department 
                }
            ])
            //callback
            .then(response =>{
                const dept = response.department;
                money.push(dept);
                
                const deptSql =`
                INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)
                `;
                //connect with the query
                db.query(depSql, (err, data)=>{
                    if(err){
                        console.log(err);
                    }
                    console.log(response.role + 'is successfully added');
                    viewAllRole();
                })
            })
        })
    })
}

//view all department function
const viewAllDepartment = () =>{
    console.log('please view the department below:');

    const deptSql = `SELECT department.
    id AS id, department.name AS department 
    FROM department
    `;
    db.promise().query(deptSql) 
    .then( ([rows,fields]) => {
        console.table(rows);
      })
      .catch(console.log)
      employeePrompt();
}

//Add department function 
const addDepartment = () =>{
    inquirer.prompt([
        {
           type:'input',
           name:'department',
           message:'What department you want add?' 
        }
    ])
    .then(response =>{
        const department = `
        INSERT INTO department (name)
        VALUES (?)
        `;
        db.query(department, response.department, (err, data) =>{
            if(err){
                console.log(err);
            }
            console.log(response.department + 'is successfully added');
            //execute view department
            viewAllDepartment();
        })
    })
}