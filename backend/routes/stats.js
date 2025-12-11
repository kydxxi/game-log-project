const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares');
const statsCtrl = require('../controllers/stats');

// GET /api/stats/me?range=weekly or monthly
router.get('/me', isLoggedIn, statsCtrl.getMyStats);

module.exports = router;
