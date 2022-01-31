const express = require( 'express' );
const db = require( './db/connection' );
const routes = require( './routes' );
const main = require('./lib/app')

const PORT = process.env.PORT || 3001;
const app = express();

app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );

app.use( '/', routes );

db.connect( err => {
    if ( err ) throw err;
    console.log( '\nDatabase Connected' );
    app.listen( PORT, () => {
        console.log( `Server live! Running at http://localhost:${ PORT }` );
    } );
} );

main();