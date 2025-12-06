const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require(process.cwd() + '/models');

exports.signup = async (req, res) => {
  const { email, nickname, password } = req.body;
  try {
    const [exist] = await db.execute(
      'SELECT id FROM users WHERE email=?',
      [email]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)',
      [email, hash, nickname]
    );

    return res.status(201).json({
      user: {
        id: result.insertId,
        email,
        nickname
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Signup error' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info?.message || 'Login failed' });
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json({ user });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
};

exports.me = (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  res.json({ user: req.user });
};
