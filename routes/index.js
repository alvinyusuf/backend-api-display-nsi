const express = require('express');

const router = express.Router();

const maintenanceRoutes = require('./maintenance');

router.use('/', (req, res) => res.json({ message: 'halaman routes api' }));
router.use('/maintenance', maintenanceRoutes);

module.exports = router;
