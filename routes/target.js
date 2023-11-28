const express = require('express');
const targetController = require('../controller/targetController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router target' }));
router.get('/get-qmp', targetController.getQmp);
router.get('/get-monthly', targetController.getMonthly);
router.get('/get-downtime', targetController.getTargetDowntime);

module.exports = router;
