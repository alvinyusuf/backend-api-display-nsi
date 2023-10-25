const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router maintenance' }));
router.get('/downtime', (req, res) => res.json({ message: 'routes downtime bulan ini' }));
router.get('/downtime-1', (req, res) => res.json({ message: 'routes downtime 1 bulan lalu' }));
router.get('/downtime-2', (req, res) => res.json({ message: 'routes downtime bulan 2 lalu' }));
router.get('/data-downtime', (req, res) => res.json({ message: 'routes data downtime tiap mesin' }));
router.get('/history-downtime', (req, res) => res.json({ message: 'routes history downtime' }));

module.exports = router;
