const db = require('../models');

// 팔로잉 목록 조회 (GET /follows/me)
exports.getMyFollowing = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const [rows] = await db.execute(
      `
      SELECT u.id, u.email, u.nickname
      FROM follows f
      JOIN users u ON f.followee_id = u.id
      WHERE f.follower_id = ?
      ORDER BY u.nickname ASC, u.id ASC
      `,
      [userId],
    );

    return res.json({ following: rows });
  } catch (err) {
    next(err);
  }
};

// 팔로우 (POST /follows/:targetUserId)
exports.followUser = async (req, res, next) => {
  try {
    const followerId = req.user?.id;
    const followeeId = parseInt(req.params.targetUserId, 10);

    if (!followerId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    if (Number.isNaN(followeeId)) {
      return res.status(400).json({ message: '유효한 사용자 ID가 아닙니다.' });
    }

    if (followerId === followeeId) {
      return res.status(400).json({ message: '자기 자신은 팔로우할 수 없습니다.' });
    }

    // 대상 유저 존재 여부 확인 (선택사항이지만 안전하게)
    const [userRows] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [followeeId],
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    // 팔로우 추가 (중복 방지는 UNIQUE(follower_id, followee_id) 가정)
    try {
      await db.execute(
        `
        INSERT INTO follows (follower_id, followee_id, created_at)
        VALUES (?, ?, NOW())
        `,
        [followerId, followeeId],
      );
    } catch (err) {
      // 이미 팔로우 중인 경우: 중복 에러 무시하고 동일 응답
      if (err.code !== 'ER_DUP_ENTRY') {
        throw err;
      }
    }

    return res.json({ message: 'Followed' });
  } catch (err) {
    next(err);
  }
};

// 언팔로우 (DELETE /follows/:targetUserId)
exports.unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user?.id;
    const followeeId = parseInt(req.params.targetUserId, 10);

    if (!followerId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    if (Number.isNaN(followeeId)) {
      return res.status(400).json({ message: '유효한 사용자 ID가 아닙니다.' });
    }

    await db.execute(
      `
      DELETE FROM follows
      WHERE follower_id = ? AND followee_id = ?
      `,
      [followerId, followeeId],
    );

    // 존재하지 않았어도 idempotent 하게 항상 동일 응답
    return res.json({ message: 'Unfollowed' });
  } catch (err) {
    next(err);
  }
};
