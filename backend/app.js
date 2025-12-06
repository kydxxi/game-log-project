const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const passportConfig = require('./passport');
const authRouter = require('./routes/auth');

const app = express();

passportConfig();
app.set('port', process.env.PORT || 4000);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'session-secret-key'));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'session-secret-key',
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'NOT FOUND' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'SERVER ERROR' });
});

app.listen(app.get('port'), () => {
  console.log(`Backend running on http://localhost:${app.get('port')}`);
});
