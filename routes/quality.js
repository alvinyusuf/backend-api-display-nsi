const express = require('express');
const qualityController = require('../controller/qualityController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router quality' }));
router.get('/report', qualityController.getReportDepartement);

module.exports = router;
