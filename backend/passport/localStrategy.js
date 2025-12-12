const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require(process.cwd() + '/models');

module.exports = () => {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      console.log('LOGIN TRY:', email); 
      try {
        const [rows] = await db.execute(
          'SELECT * FROM users WHERE email=?',
          [email]
        );

        console.log('FOUND USER COUNT:', rows.length); 

        if (rows.length === 0) {
          return done(null, false, { message: 'Email not found' });
        }

        const user = rows[0];

        const valid = await bcrypt.compare(password, user.password_hash);
        console.log('PASSWORD VALID:', valid); 

        if (!valid) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        });
      } catch (err) {
        console.error('LOCAL STRATEGY ERROR:', err);
        return done(err);
      }
    }
  );
};
