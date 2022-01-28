// employeeRoutes.js
const router = require( 'express' ).Router();
const db = require( '../../db/connection' );

// ROUTES (employee)
// GET all employees
router.get( '/employees', ( req, res ) => {
    const sql = `SELECT * FROM employee`;

    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: rows } );
    } );
} );

// GET single employee by id 

// POST route to create a employee

// PUT route to update employee role or something..

// DELETE single employee by id

module.exports = router;