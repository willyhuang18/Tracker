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

//check any connection err to the sql 
db.connect(err => {
    if(err){
        throw err;
    }
    console.log(db.threadId);
})


//welcome image
console.log("*---------------------------------*");
console.log("|                                 |");
console.log("|             Welcome             |");
console.log("|                to               |");
console.log("|            the Company          |");
console.log("|                                 |");
console.log("*---------------------------------*");
employeePrompt();

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
                viewEmployee();
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
    db.promise().query(sql, (err, result) =>{
        if(err){
            throw err;
        }
        console.log(result);
    });
}
//view add employee
const addEmployee = () => {
    inquirer.prompt([{
      type:'input',
      name:'firstName',
      message:'What is the your First name?',  
    },
    {
        type:'input',
        name:'lastName',
        message:'What is the your Last name?', 
    }
    ])
    //adding the role for the employee
    .then(response =>{
        //using sql query to get the data frm sql file
        const input = [response.firstName, response.lastName]
        //insert the role from role table
        const role = `SELECT role.id, role.title FROM role`;
        db.promise().query(role, (err, data) => {
            if(err){
                console.log(err);
            }
            const roleId = data.map(({id, title}) => (
                {name: title, value: id}
                ));
            //insert the 'roleId' as the choice for the following prompt
            inquirer.prompt([
                {
                type: 'list',
                name: 'role',
                message: "What is the position you at?",
                choices: roleId
                }
            ])
            //push the data into the array
            .then(choice=>{
                const roles = choice.role;
                input.push(roles);

                //do the same to the manager_id
                const manager = `SELECT * FROM employee`;
                db.promise().query(manager, (err, data)=>{
                    if(err){
                        console.log(err);
                    }
                    const managerId = data.map(({id, firstName, lastName}) => 
                        ({
                            name: firstName + lastName, value: id
                        }));
                        console.log(managerId);

                    //adding prompt for the manager
                    //insert the mangerId as the choice
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the position you at?",
                            choices: managerId
                        }
                    ])
                    .then(choices =>{
                        const managers = choices.manager;
                        input.push(managers);
                        const employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                        db.query(employeeSql, input, (err, result)=>{
                            if(err){
                                console.log(err);
                            }
                            console.log("Employee Added");
                            //execute the employee function
                            viewEmployee();
                        })
                    })
                })
            })
        })
    })
}
