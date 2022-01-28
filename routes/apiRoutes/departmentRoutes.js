// departementRoutes.js
const router = require( 'express' ).Router();
const db = require( '../../db/connection' );

// ROUTES (department)
// GET all departments
router.get( '/departments', ( req, res ) => {
    const sql = `SELECT * FROM department`;

    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: rows } );
    } );
} );

// GET single department by id 
router.get( '/department/:id', ( req, res ) => {
    const sql = `SELECT * FROM department WHERE id = ?`;

    db.query( sql, req.params.id, ( err, row ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        // TODO: add 404
        res.status( 200 ).json( { data: row } );
    } );
} );

// POST route to create a department
router.post( '/departments', ( { body }, res ) => {
    // validate department has name
    const sql = `INSERT INTO department (name) VALUES (?)`;

    db.query( sql, body.name, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: result } );
    } );
} );

// PUT route to update department

// DELETE single department by id
router.delete( '/department/:id', ( req, res ) => {
    const sql = `DELETE FROM department WHERE id = ?`;

    db.query( sql, req.params.id, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message + " error" } );
        } else if ( !result.affectedRows ) {
            res.json( { message: 'No Department Found' } );
        } else {
            res.status( 200 ).json( {
                changes: result.affectedRows,
                id: req.params.id
            } );
        }
    } );
} );

module.exports = router;