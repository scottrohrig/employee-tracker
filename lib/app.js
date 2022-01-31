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
