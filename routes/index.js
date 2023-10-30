const express = require('express');

const router = express.Router();

const maintenanceRoutes = require('./maintenance');
const productionRoutes = require('./production');
const qualityRoutes = require('./quality');

router.get('/', (req, res) => res.json({ message: 'halaman routes api' }));
router.use('/maintenance', maintenanceRoutes);
router.use('/production', productionRoutes);
router.use('/quality', qualityRoutes);

module.exports = router;
