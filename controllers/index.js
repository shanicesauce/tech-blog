const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-route');
const dashboardRoutes = require('./dashboard-route')

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

router.use((req,res) => {
    res.status(404).end();
});

module.exports = router;