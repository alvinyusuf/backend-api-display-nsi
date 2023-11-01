const express = require('express');

const router = express.Router();

const maintenanceRoutes = require('./maintenance');
const productionRoutes = require('./production');
const qualityRoutes = require('./quality');
const salesRoutes = require('./sales');

router.get('/', (req, res) => res.json({ message: 'halaman routes api' }));
router.use('/maintenance', maintenanceRoutes);
router.use('/production', productionRoutes);
router.use('/quality', qualityRoutes);
router.use('/sales', salesRoutes);

module.exports = router;
