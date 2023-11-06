const express = require('express');
const salesController = require('../controller/salesController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router sales' }));
router.get('/customer', salesController.getListCustomer);
router.get('/customer/:customer', salesController.getDetailCustomer);
router.get('/get-actual', salesController.getActualOnYear);
router.get('/cek/:customer', salesController.getCheck);

module.exports = router;
