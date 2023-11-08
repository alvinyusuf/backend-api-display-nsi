const express = require('express');
const salesController = require('../controller/salesController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router sales' }));
router.get('/customer', salesController.getListCustomer);
router.get('/customer/:customer', salesController.getDetailCustomer);
router.get('/get-actual', salesController.getActualOnYear);
router.get('/get-actual/detail', salesController.getDetailActual);
router.get('/cek/:customer', salesController.getCheck); // cek improve get detail customer by full customer name

module.exports = router;
