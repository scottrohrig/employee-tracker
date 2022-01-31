const db = require( "../db/connection" );
const inquirer = require( 'inquirer' );

const options = [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
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

const addDepartment = async ( name ) => {
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
const removeDepartment = async ( id ) => {
    const sql = `DELETE FROM department WHERE id = ?`;

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
