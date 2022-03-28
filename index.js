const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

const dbData = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker_db'
  },
  console.log('Connected to the tracker_db database')
);

dbData.query = util.promisify(dbData.query);


const init = async() => {
  try {
  let data = await inquirer.prompt([{
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
   .then(function (data){ 
      switch (data.options) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
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
      };
    });
    } catch (err) {
      console.error(err);
      init();
    };
};

const viewDepartments = async () => {
  let query = 'SELECT * FROM department'
  dbData.query(query, function(err, res) {
    if (err) {
      console.log(err);
    };
    let deptArray = [];
    res.forEach(department => deptArray.push(department));
    console.table(deptArray);
    init();
  });
};

const viewRoles = async () => {
  let query = 'SELECT * FROM role'
  dbData.query(query, function(err, res) {
    if (err) {
      console.log(err);
    };
    let roleArray = [];
    res.forEach(role => roleArray.push(role));
    console.table(roleArray);
    init();
  });
};




const viewEmployees = async () => {
  let query = 'SELECT * FROM employee'
  dbData.query(query, function(err, res) {
    if (err) {
      console.log(err);
    };
    let employeeArray = [];
    res.forEach(employee => employeeArray.push(employee));
    console.table(employeeArray);
    init();
  });
};



const addDepartment = async () => {
  try {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of your department?"   
    }
  ]);
  const result = await dbData.query(`INSERT INTO department (name) VALUES (?)`, [
     answer.department
]);
  console.log(`${answer.department} successfully added to departments.\n`)
} catch (err) {
  console.log(err);
};
init();
};



// const addRole = async () => {
//   try {
//   const department = await dbData.query(`SELECT name FROM department;`);
//   const answer = await inquirer.prompt([
//     {
//       type: "input",
//       name: "role",
//       message: "What is the name of the role?",
//       validate: answer => {
//         if (answer !== "") {
//           return true;
//         }
//         console.log("Please enter the name of the role.");
//         return false;
//       }
//   },
//   {
//     type: "input",    
//     name: "salary",
//     message: "What is the salary of the role?",
//     validate: answer => {
//       if (answer !== "") {
//         return true;
//       }
//       console.log("Please enter the salary for that role.");
//       return false;
//     }
//   },
//   {
//     type: "input",
//     name: "roleDepartment",
//     message: "What department does that role belong to?",
//     validate: answer => {
//       if (answer !== "") {
//         return true;
//       }
//       console.log("Please enter the department for this role.");
//       return false;
//     }
//   }
// ])
// let chosenDept;
// for (i = 0; i < department.length; i++) {
//   if(department[i].department_id === answer.choice) {
//     chosenDept = department[i];
//   };
// }
// let result = await dbData.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?);`, {
//   title: answer.title,
//   salary: answer.salary,
//   department_id: answer.deptId
// })
// } catch (err) {
//   console.error(err);
//   init();
//   };
// };


const addRole = async() => {
  const result = await inquirer.prompt([
    {
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
    type: "input",
    name: "roleDepartment",
    message: "What department does that role belong to?",
    validate: answer => {
      if (answer !== "") {
        return true;
      }
      console.log("Please enter the department for this role.");
      return false;
    }
  }
])
  const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
  const params = [result.role, result.salary, result.department];

  dbData.query(sql, params, function (err, results) {
    console.log("");
    console.table(results);
  });
  console.log(`${result.role} role added successfully.\n`)
  init();
}





const addEmployee = async() => {
  try {
    let roles = await dbData.query("SELECT * FROM role");
    let managers = await dbData.query("SELECT * FROM employee");
  let answer = await inquirer.prompt([
    {
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
    name: "manager",
    message: "Who is the employees manager?",
    validate: answer => {
      if (answer !== "") {
        return true;
      }
      console.log("Please enter the department for this role.");
      return false;
    }
  }
])
let result = await dbData.query("INSERT INTO employee SET ?", {
  first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });
        console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);

  } catch (err) {
    console.log(err);
    init();
  };
}

init();