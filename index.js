const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');
const connection = require('./config');


connection.query = util.promisify(connection.query);

// Connection to database
connection.connect(function (err) {
  if (err) throw err;
  init();
})

// Initial questions 
const init = async () => {
  try {
    let answer = await inquirer.prompt({
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Update an employees manager",
        "Quit",
      ]
    });
    switch (answer.options) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Update an employees manager':
          updateEmployeeManager();
        break;
      case 'Quit':
        process.exit(1);
    };
  } catch (err) {
    console.log(err);
    init();
  };
}

  // View all departments function
  const viewDepartments = async () => {
    console.log('View departments');
    try {
      let query = 'SELECT * FROM department';
      connection.query(query, function (err, res) {
        if (err) throw err;
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table(departmentArray);
        init();
      });
    } catch (err) {
      console.log(err);
      init();
    };
  }

// View all roles function
const viewRoles = async () => {
  console.log('View roles');
  try {
    let query = 'SELECT * FROM role LEFT JOIN department ON role.department_id = department.id';
    connection.query(query, function (err, res) {
      if (err) throw err;
      let roleArray = [];
      res.forEach(role => roleArray.push(role));
      console.table(roleArray);
      init();
    });
  } catch (err) {
    console.log(err);
    init();
  };
}

// View all Employees function
const viewEmployees = async () => {
  console.log('View employees');
  try {
    let query = 'SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id';
    connection.query(query, function (err, res) {
      if (err) throw err;
      let employeeArray = [];
      res.forEach(employee => employeeArray.push(employee));
      console.table(employeeArray);
      init();
    });
  } catch (err) {
    console.log(err);
    init();
  };
}

// Add department function
const addDepartment = async () => {
  try {
    console.log('Adding a new department');

    let answer = await inquirer.prompt([{
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of your department?'
    }]);

    let result = await connection.query("INSERT INTO department SET ?", {
      name: answer.departmentName
    });

    console.log(`${answer.departmentName} added successfully to departments.\n`)
    init();

  } catch (err) {
    console.log(err);
    init();
  };
}

// Adding a new role function
const addRole = async () => {
  try {
    console.log('Add Role');

    let departments = await connection.query("SELECT role.id, title, salary FROM role LEFT JOIN department ON role.department_id = department.id")

    let answer = await inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does this role belong to?',
        choices: departments.map((departmentId) => {
          return {
            name: departmentId.name,
            value: departmentId.id
          }
        }),
      }
    ]);

    let chosenDepartment;
    for (i = 0; i < departments.length; i++) {
      if (departments[i].department_id === answer.choice) {
        chosenDepartment = departments[i];
      };
    }
    let result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId
    })

    console.log(`${answer.title} role added successfully.\n`)
    init();

  } catch (err) {
    console.log(err);
    init();
  };
}

// Add an employee function
const addEmployee = async () => {
  try {
    console.log('Adding new employee');

    let roles = await connection.query("SELECT * FROM role");

    let managers = await connection.query("SELECT * FROM employee");

    let answer = await inquirer.prompt([{
        type: 'input',
        name: 'firstName',
        message: 'What is the first name of this employee?'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the last name of this employee?'
      },
      {
        type: 'list',
        name: 'employeeRoleId',
        message: "What is this Employee's role id?",
        choices: roles.map((role) => {
          return {
            name: role.title,
            value: role.id
          }
        }),
      },
      {
        name: 'employeeManagerId',
        type: 'list',
        message: "What is this Employee's Manager's Id?",
        choices: managers.map((manager) => {
            return {
                name: manager.first_name + " " + manager.last_name,
                value: manager.id
            }
        }),
    }
    ])

    let result = await connection.query("INSERT INTO employee SET ?", {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: (answer.employeeRoleId),
      manager_id: (answer.employeeManagerId)
    });

    console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
    init();

  } catch (err) {
    console.log(err);
    init();
  };
}

// Update an employee role function
const updateEmployeeRole = async () => {
  try {
    console.log('Updating employee role');

    let employees = await connection.query("SELECT * FROM employee");

    let employeeSelection = await inquirer.prompt([{
      type: 'list',
      name: 'employee',
      message: 'Which employee do you want to update?',
      choices: employees.map((employeeName) => {
        return {
          name: employeeName.first_name + " " + employeeName.last_name,
          value: employeeName.id
        }
      }),
    }]);

    let roles = await connection.query("SELECT * FROM role");

    let roleSelection = await inquirer.prompt([{
      type: 'list',
      name: 'role',
      message: 'Please select the role to update the employee with.',
      choices: roles.map((roleName) => {
        return {
          name: roleName.title,
          value: roleName.id
        }
      }),
    }]);

    let result = await connection.query("UPDATE employee SET ? WHERE ?", [{
      role_id: roleSelection.role
    }, {
      id: employeeSelection.employee
    }]);

    console.log(`The role was successfully updated.\n`);
    init();

  } catch (err) {
    console.log(err);
    init();
  };
}


// Update an employee role function
const updateEmployeeManager = async () => {
  try {
    console.log('Updating employee role');

    let employees = await connection.query("SELECT * FROM employee");

    let employeeSelection = await inquirer.prompt([{
      type: 'list',
      name: 'employee',
      message: 'Which employee do you want to update?',
      choices: employees.map((employeeName) => {
        return {
          name: employeeName.first_name + " " + employeeName.last_name,
          value: employeeName.id
        }
      }),
    }]);

    let managers = await connection.query("SELECT * FROM employee");

    let managerSelection = await inquirer.prompt([{
      type: 'list',
      name: 'role',
      message: 'Please select the manager to update the employee with.',
      choices: managers.map((manager) => {
        return {
            name: manager.first_name + " " + manager.last_name,
            value: manager.id
        }
    }),
    }]);

    let result = await connection.query("UPDATE employee SET ? WHERE ?", [{
      manager_id: managerSelection.role
    }, {
      id: employeeSelection.employee
    }]);

    console.log(`The manager was successfully updated.\n`);
    init();

  } catch (err) {
    console.log(err);
    init();
  };
}