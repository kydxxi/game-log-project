const express = require('express');
const router = express.Router();

const followsCtrl = require('../controllers/follows');
const { isLoggedIn } = require('../middlewares');

// 내 팔로잉 목록 (GET /api/follows/me)
router.get('/me', isLoggedIn, followsCtrl.getMyFollowing);

// 팔로워 목록 조회
router.get('/followers/me', isLoggedIn, followsCtrl.getMyFollowers);

// 팔로우 (POST /api/follows/:targetUserId)
router.post('/:targetUserId', isLoggedIn, followsCtrl.followUser);

// 언팔로우 (DELETE /api/follows/:targetUserId)
router.delete('/:targetUserId', isLoggedIn, followsCtrl.unfollowUser);

module.exports = router;
