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
});

//welcome image
console.log("*---------------------------------*");
console.log("|                                 |");
console.log("|             Welcome             |");
console.log("|                to               |");
console.log("|            the Company          |");
console.log("|                                 |");
console.log("*---------------------------------*");