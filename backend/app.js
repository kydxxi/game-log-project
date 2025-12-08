const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');

const sessionRouter = require('./routes/sessions');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');

dotenv.config();

const app = express();
passportConfig();

app.set('port', process.env.PORT || 4000);

// 1. 로깅
app.use(morgan('dev'));

// 2. CORS (라우터보다 먼저, preflight 포함)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
// OPTIONS 프리플라이트도 같은 설정으로 처리
app.options(
  '*',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// 3. body 파서
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4. 쿠키 + 세션
app.use(cookieParser(process.env.COOKIE_SECRET || 'session-secret-key'));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'session-secret-key',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 5. passport 초기화 (세션 뒤에)
app.use(passport.initialize());
app.use(passport.session());

// 6. 라우터들 (모든 미들웨어 설정 뒤에)
app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);

// 7. 404 핸들러
app.use((req, res, next) => {
  res.status(404).json({ message: 'NOT FOUND' });
});

// 8. 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'SERVER ERROR' });
});

// 9. 서버 실행
app.listen(app.get('port'), () => {
  console.log(`Backend running on http://localhost:${app.get('port')}`);
});
