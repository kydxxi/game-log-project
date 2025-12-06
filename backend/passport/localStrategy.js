const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require(process.cwd() + '/models');

module.exports = () => {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const [rows] = await db.execute(
          'SELECT * FROM users WHERE email=?',
          [email]
        );

        if (rows.length === 0) {
          return done(null, false, { message: 'Email not found' });
        }

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          nickname: user.nickname
        });
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  );
};
