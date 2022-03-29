const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./config');
const res = require('express/lib/response');


const init = async () => {
  try {
    let data = await inquirer.prompt([{
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "Add an employee",
          "Update an employee role",
          "View all roles",
          "Add a role",
          "View all departments",
          "Add a department",
          "Quit",
        ]
      }])
      .then(function (data) {
        switch (data.options) {
          case "View all employees":
            viewEmployees();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateEmployeeRole();
            break;
          case "View all roles":
            viewRoles();
            break;
          case "Add a role":
            addRole();
            break;
          case "View all departments":
            viewDepartments();
            break;
          case "Add a department":
            addDepartment();
            break;
            case "Quit":
              process.exit(1);
        };
      });
  } catch (err) {
    console.error(err);
    init();
  };
};



const viewDepartments = async (req, res) => {
  try {
    const getAllDepartments = 'SELECT * FROM department';
    const [name] = await connection.query(getAllDepartments);
    console.table(name);
  } catch (e) {
    console.log(e);
  }
  init();
};



const viewRoles = async (req, res) => {
  try {
    const getAllRoles = 'SELECT * FROM role';
    const [role] = await connection.query(getAllRoles);
    console.table(role);
  } catch (e) {
    console.log(e);
  }
  init();
};


const viewEmployees = async (req, res) => {
  try {
    const getAllEmployees = 'SELECT * FROM employee';
    const [employee] = await connection.query(getAllEmployees);
    console.table(employee);
  } catch (e) {
    console.log(e)
  }
  init();
};



const addDepartment = async () => {

  const answer = await inquirer.prompt([{
    type: "input",
    name: "departmentName",
    message: "What is the name of your department?"
  }]);
  try {

    const result = await connection.query(`INSERT INTO department SET ?`, {
      name: answer.departmentName
    });
    console.log(`${answer.departmentName} successfully added to departments.\n`)
  } catch (err) {
    console.log(err);
  };
  init();
};



const addRole = async () => {
  let department = await connection.query('SELECT * FROM department');
  let answer = await inquirer.prompt([{
      type: "input",
      name: "role",
      message: "What is the name of the role?",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the name of the role.");
        return false;
      }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the salary for that role.");
        return false;
      }
    },
    {
      type: 'list',
      name: 'departmentName',
      message: 'Which department does this role belong to?',
      choices: department.map((departmentName) => {
        return {
          name: departmentName.department_name,
          value: departmentName.id

        }
      }),
    }
  ]);
  try {

    let chosenDept;
    for (i = 0; i < department.length; i++) {
      if (department[i].department === answer.choice) {
        chosenDept = department[i];
      };
    }
    let result = await connection.query("INSERT INTO role SET ?", {
      title: answer.role,
      salary: answer.salary,
      department: answer.departmentId
    })
    console.log(`${answer.role} successfully added to departments.\n`)
  } catch (err) {
    console.log(err);
  };
  init();
};



const addEmployee = async (req, res) => {
  // let roles = await connection.query("SELECT * FROM role");
  // let managers = await connection.query("SELECT * FROM employee");

  let answer = await inquirer.prompt([{
      type: "input",
      name: "firstName",
      message: "What is the employees first name??",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the first name of the employee.");
        return false;
      }
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the last name of the employee?",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the last name of the employee.");
        return false;
      }
    },
    {
      type: "input",
      name: "role",
      message: "What is the employees role?",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the role for this employee.");
        return false;
      }
    },
    {
      type: "input",
      name: "manager",
      message: "Who is the employees manager?",
      validate: answer => {
        if (answer !== "") {
          return true;
        }
        console.log("Please enter the department for this role.");
        return false;
      }
    },

  ])
  try {
    let result = await connection.query("INSERT INTO employee SET ?", {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: (answer.employeeRoleId),
      manager_id: (answer.employeeManagerId)
    });
    console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);

  } catch (err) {
    console.log(err);
  };
  init();
}

init();