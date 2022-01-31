const db = require( "../db/connection" );
const inquirer = require( 'inquirer' );

const options = [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Remove a department",
    "Add a role",
    "Add an employee",
    "Update an employee role",
    "Exit"
];

/** Returns All Departments (id, name)
 */
const viewAllDepartments = async () => {
    try {
        const [ rows ] = await db
            .promise()
            .query( `SELECT * FROM department` );
        return rows;
    } catch ( err ) {
        return err;
    }
};

/** returns the id of the department given it name:
 * - example: 
 *      ```js
 *      getDepartmentId( 'Management' )
 *          .then( ( [ { id } ] ) => console.log( id ) );
 *      ```
 * @param {String} name 
 * @returns 
 */
const getDepartmentId = async ( name ) => {
    const sql = `SELECT department.id FROM department WHERE department.name = ?`;
    const [ row ] = await db
        .promise()
        .query( sql, [ name ] );
    return row;
};

const addDepartment = async () => {

    const { name } = await inquirer.prompt( {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
        validate( name ) {
            if ( !name ) {
                console.log( 'Enter a Department Name' );
                return false;
            }
            return true;
        }
    } )

    const sql = `INSERT INTO department (name) VALUES (?)`;
    try {
        const [ row ] = await db
            .promise()
            .query( sql, name );
        return row;
    } catch ( err ) { return err; }
};

const listDepartments = async () => {
    return viewAllDepartments()
        .then( data => data.map( ( { name } ) => ( name ) ) );
};
const removeDepartment = async () => {

    const departments = await viewAllDepartments();

    const { choice } = await inquirer.prompt( {
        type: 'list',
        name: 'choice',
        message: 'Choose a department to remove',
        choices: departments.map( ( { name, id } ) => `${ id }: ${ name }` )
    } );

    const sql = `DELETE FROM department WHERE id = ?`;

    const id = choice.split( ':' )[ 0 ]

    try {
        const [ result ] = await db
            .promise()
            .query( sql, id );
        return result;
    } catch ( err ) { return err; }
};

/** Returns All Roles with the following Fields:
 * - job title, role id, the department that role belongs to, and the salary for that role
 * 
 * @returns 
 */
 const viewAllRoles = async () => {
    const sql = `
        SELECT
            role.title,
            role.id,
            department.name AS department,
            role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id
        `;
    const [ rows ] = await db
        .promise()
        .query( sql )
        .then( ( res ) => res )
        .catch( err => {
            throw err;
        } );
    return rows;
};

const getRoleData = async () => {
    const departments = await listDepartments();

    return inquirer.prompt( [
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role you wish to add: ',
            validate( title ) {
                if ( !title ) {
                    console.log( 'Please enter a role.' );
                    return false;
                }
                return true;
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: "Enter the salary for the new role: "
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose a department for this role:',
            choices: departments
        }
    ] );
};

const addRole = async () => {

    const { title, salary, department } = await getRoleData().then( data => data );

    const department_id = await getDepartmentId( department )
        .then( ( [ { id } ] ) => id );

    const sql = `INSERT INTO role (title, salary, department_id) 
        VALUES (?,?,?)`;

    try {
        const [ row ] = await db
            .promise()
            .query( sql, [
                title,
                salary,
                department_id
            ] );
        return row;
    } catch ( err ) { return err; }
};

const getNewRole = async () => {
    const roles = await viewAllRoles();

    const newRole = await inquirer.prompt( [
        {
            type: 'list',
            name: 'title',
            message: 'Choose a new role',
            choices: roles.map( ( { title, id } ) => `${ id }:${ title }` )
        }
    ] );

    let new_id = roles.filter(
        role => role.id === parseInt( newRole.title.split( ':' )[ 0 ] ) );

    return new_id[ 0 ];
};

/** Returns All Employees with the following Fields: 
 * - employee ids, first names, last names, 
 * job titles, departments, salaries, 
 * and managers that the employees report to
 * @returns 
 */
const viewAllEmployees = async () => {
    const sql = `
        SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            role.title,
            department.name AS department,
            role.salary,
            CONCAT(mngr.first_name," ",mngr.last_name) AS manager
        FROM employee 
        LEFT JOIN employee mngr ON employee.manager_id = mngr.id
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
            `;
    try {
        const [ rows ] = await db
            .promise()
            .query( sql );
        return rows;
    } catch ( err ) { return err; }
};

const getEmployeeData = async () => {

    const roles = await viewAllRoles();
    const managers = await viewAllEmployees();

    let employee = await inquirer.prompt( [
        {
            type: "input",
            name: "first_name",
            message: "First name: ",
            validate: function ( first_name ) {
                if ( !first_name ) {
                    console.log( "Field Required" );
                    return false;
                }
                return true;
            }
        },
        {
            type: "input",
            name: "last_name",
            message: "Last name: ",
            validate: function ( last_name ) {
                if ( !last_name ) {
                    console.log( "Field Required" );
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'title',
            message: 'Enter their title',
            choices: roles.map( ( { title, id } ) => `${ id }:${ title }` )
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is their manager?',
            choices: managers.map( ( { first_name, last_name, id } ) => `${ id }:${ first_name } ${ last_name }` )
        }
    ] );

    employee.title = employee.title.split( ':' )[ 0 ];
    employee.manager = employee.manager.split( ':' )[ 0 ];
    return employee;
};

const addEmployee = async () => {
    const {
        first_name,
        last_name,
        title: role_id,
        manager: manager_id } = await getEmployeeData();

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;

    try {
        const [ row ] = await db
            .promise()
            .query( sql, [
                first_name, last_name,
                role_id, manager_id
            ], ( err, res ) => {
                if ( err ) {
                    console.log( err );
                    return;
                }
                console.log( res );
            } );
        return row;
    } catch ( err ) { return err; }
};

const listEmployees = async () => {
    const sql = `SELECT CONCAT(first_name, ' ' , last_name) as name FROM employee`;
    const [ rows ] = await db
        .promise()
        .query( sql )
        .then( res => res )
        .catch( err => err );
    return rows;
};

const getEmployeeByName = async ( name ) => {
    // name = name.trim();
    const sql = `
        SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            role.title,
            employee.role_id,
            department.name AS department,
            role.salary,
            CONCAT(mngr.first_name," ",mngr.last_name) AS manager
        FROM employee 
        LEFT JOIN employee mngr ON employee.manager_id = mngr.id
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE CONCAT(employee.first_name, ' ',employee.last_name) = ?
    `;
    const [ row ] = await db
        .promise()
        .query( sql, name, ( err, res ) => {
            if ( err ) {
                return err;
            }
            return res;
        } );
    return row[ 0 ];
};

const selectEmployee = async () => {
    const employees = await listEmployees();
    const { employee } = await inquirer.prompt( {
        type: 'list',
        name: 'employee',
        message: 'Choose an Employee:',
        choices: employees
    } );
    return getEmployeeByName( employee );
};

const updateEmployeeRoll = async () => {

    const employee = await selectEmployee();

    const { confirmEmployee } = await inquirer.prompt( {
        type: 'confirm',
        name: 'confirmEmployee',
        message: `Is this the correct employee? \n${ console.table( employee ) }`
    } );

    if ( !confirmEmployee ) {
        return updateEmployeeRoll();
    }

    const { id: role_id } = await getNewRole();

    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

    const params = [ role_id, employee.id ];

    db.query( sql, params, ( err, result ) => {
        if ( err ) {
            console.log( err );
            // main function
        } else if ( !result.affectedRows ) {
            console.log( 'No Employee Found' );
            // main func
        } else {
            console.log( result );
            // main
        }
    } );
};

const start = async () => {

    const { option } = await inquirer.prompt( {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: options
    } );

    switch ( option ) {
        case options[ 0 ]:
            const departments = await viewAllDepartments();
            console.table( departments );
            start();
            break;
        case options[ 1 ]:
            const roles = await viewAllRoles();
            console.table( roles );
            start();
            break;
        case options[ 2 ]:
            const employees = await viewAllEmployees();
            console.table( employees );
            start();
            break;
        case options[ 3 ]:
            await addDepartment();
            start();
            break;
        case options[ 4 ]:
            await removeDepartment();
            start();
            break;
        case options[ 5 ]:
            await addRole();
            start();
            break;
        case options[ 6 ]:
            await addEmployee();
            start();
            break;
        case options[ 7 ]:
            await updateEmployeeRoll();
            start();
            break;
        case 'Exit':
            process.exit();
            break;
        default:
            console.log( 'Oops, try again.' );
            start();
            break;
    }

};

async function main() {

    await start();

}

main();