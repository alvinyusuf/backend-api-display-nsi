const express = require('express');

const router = express.Router();

const maintenanceRoutes = require('./maintenance');
const productionRoutes = require('./production');

router.use('/', (req, res) => res.json({ message: 'halaman routes api' }));
router.use('/maintenance', maintenanceRoutes);
router.use('/production', productionRoutes);

module.exports = router;
