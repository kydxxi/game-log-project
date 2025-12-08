const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controllers/comments');
const { isLoggedIn } = require('../middlewares');

// 댓글 작성
router.post('/', isLoggedIn, commentsCtrl.createComment);

// 댓글 조회
router.get('/', commentsCtrl.getComments);

// 댓글 삭제
router.delete('/:id', isLoggedIn, commentsCtrl.deleteComment);

module.exports = router;
