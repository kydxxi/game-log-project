exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: '로그인이 필요합니다.' });
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    next();
  } else {
    res.status(400).json({ message: '이미 로그인 상태입니다.' });
  }
};
