const express = require('express');
const targetController = require('../controller/targetController');

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'router target' }));
router.get('/get-target', targetController.getTarget);

module.exports = router;
