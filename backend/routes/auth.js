const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../config/db');

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exist.length > 0) {
      return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)',
      [email, hash, nickname]
    );

    res.json({
      id: result.insertId,
      email,
      nickname
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '회원가입 실패' });
  }
});

// 로그인
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info?.message });

    req.logIn(user, err2 => {
      if (err2) return next(err2);

      return res.json({ user });
    });
  })(req, res, next);
});

// 로그인 상태 확인
router.get('/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: req.user });
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
