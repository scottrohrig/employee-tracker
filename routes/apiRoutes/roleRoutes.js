const router = require( 'express' ).Router();
const db = require( '../../db/connection' );

// ROUTES (role)
// GET all
router.get( '/roles', ( req, res ) => {
    const sql = `SELECT * FROM role`;

    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } );
            return;
        }
        res.status( 200 ).json( { data: rows } );
    } );
} );

module.exports = router;