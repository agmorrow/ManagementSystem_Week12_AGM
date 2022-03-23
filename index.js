const inquirer = require('inquirer');
const cTable = require('console.table');


dbData = [];

inquirer
.prompt([{
    type: "list",
    name: "options",
    message: "What would you like to do?",
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
    ]
}])
.then(function (data) {
    switch (data.options) {
        case "View all departments":
            return;
            break;
        case "View all roles":
            return;
            break;
        case "View all employees":
            return;
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee role":
            updateEmployeeRole();
            break;
    }
})