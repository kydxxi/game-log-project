const passport = require('passport');
const local = require('./localStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
  passport.use(local());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.execute(
        'SELECT id, email, nickname FROM users WHERE id=?',
        [id]
      );
      if (rows.length === 0) {
        return done(null, false);
      }
      done(null, rows[0]);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
