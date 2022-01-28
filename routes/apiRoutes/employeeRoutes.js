// employeeRoutes.js
const router = require( 'express' ).Router();
const { Router } = require( 'express' );
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
router.get( '/employee/:id', ( req, res ) => {
    const sql = `SELECT * FROM employee WHERE id = ?`;

    db.query( sql, req.params.id, ( err, row ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: row } );
    } );
} )

// POST route to create a employee
router.get( '/employees', ( { body }, res ) => {
    // validate all fields exist

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;

    db.query( sql, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: body } );
    } );
} )

// PUT route to update employee role or something..
router.put( '/employee/:id', ( req, res ) => {
    // validate req.body, 'role'

    const sql = `UPDATE employee SET role = ? WHERE id = ?`;

    db.query( sql, req.params.id, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
        } else if ( !result.affectedRows ) {
            res.json( { message: 'No Employee Found' } );
        } else {
            res.status( 200 ).json( {
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            } );
        }
    } );
} )

// DELETE single employee by id
router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`

    db.query(sql, req.params.id, (err, result)=>{
        if(err){
            res.status(400).json({error:err.message})
        } else if (!result.affectedRows){
            res.json({message: 'Employee not found'})
        } else {
            res.sta
        }
    })
})


module.exports = router;