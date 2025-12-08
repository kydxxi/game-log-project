const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares');
const {
  createSession,
  getMySessions,
  getSessionDetail,
  deleteSession,
} = require('../controllers/sessions');

// 기록 생성
router.post('/', isLoggedIn, createSession);

// 내 기록 목록 조회
router.get('/me', isLoggedIn, getMySessions);

// 기록 상세 조회
router.get('/:id', isLoggedIn, getSessionDetail);

// 기록 삭제
router.delete('/:id', isLoggedIn, deleteSession);

module.exports = router;
