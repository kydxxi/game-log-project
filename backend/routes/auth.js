const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { signup, login, logout, me } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', isNotLoggedIn, signup);
router.post('/login', isNotLoggedIn, login);
router.get('/me', me);
router.post('/logout', isLoggedIn, logout);

module.exports = router;
