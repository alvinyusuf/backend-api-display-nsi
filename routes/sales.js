const express = require('express');
const salesController = require('../controller/salesController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router sales' }));
router.get('/customer', salesController.getListCustomer);
router.get('/get-actual', salesController.getActualOnYear);
router.get('/get-percen', salesController.getMonthlyPercent);

module.exports = router;
