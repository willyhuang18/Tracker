// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 
// import console.table
const table = require('console.table');

//connect to the database
const db = mysql.createConnection({
    host:'localhost',
    user: 'root', 
    password: 'password',
    database: 'company_db'
},
console.log(`Connected to the company_db database.`)
);

//welcome image
console.log("*---------------------------------*");
console.log("|                                 |");
console.log("|             Welcome             |");
console.log("|                to               |");
console.log("|            the Company          |");
console.log("|                                 |");
console.log("*---------------------------------*");

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
                 'Add Department'
            ]
    }])
    //give a switch method for the response
    .then(response=>{
        const {choices} = response;
        let userChoices;
        switch (choices){
            case 'View All Employees':
                break;
            case 'Add Employee':
                break;
            case 'Update Employee Role':
                break;
            case 'View All Roles':
                break;
            case 'Add Role':
                break;
            case 'View All Departments':
                break;
            case 'Add Department':
                break;
            default:
                console.log('Please enter one position');
        }
    });
}

//View All Employee function
viewEmployee = () => {
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
}