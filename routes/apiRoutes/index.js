const router = require( 'express' ).Router();

router.use( require( './departmentRoutes' ) );
router.use( require( './roleRoutes' ) );
router.use( require( './employeeRoutes' ) );
// router.use( require( './rolesRoutes' ) );

module.exports = router;