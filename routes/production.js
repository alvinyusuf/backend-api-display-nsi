const express = require('express');
const productionController = require('../controller/productionController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'routes production' }));
router.get('/percen', productionController.getProductions);
// router.get('/line', productionController.getAllLine);
router.get('/line/:line', productionController.getSpecificLine);
router.get('/history', productionController.historyProduction);

module.exports = router;
