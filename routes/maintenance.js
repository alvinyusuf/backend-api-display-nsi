const express = require('express');
const maintenanceController = require('../controller/maintenanceController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router maintenance' }));
router.get('/downtime', maintenanceController.getCurrentDowntime);
router.get('/downtime/:bulan', maintenanceController.getBeforeDowntime);
router.get('/data-downtime', maintenanceController.getCurrentMachines);
router.get('/history-downtime', maintenanceController.getHistoryDowntimes);

module.exports = router;
