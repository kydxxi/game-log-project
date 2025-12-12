const db = require('../models');

// 3-1. 댓글 작성 (POST /comments)
exports.createComment = async (req, res, next) => {
  try {
    const user = req.user;
    const { session_id, content } = req.body;

    if (!user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    if (!session_id || !content || content.trim() === '') {
      return res.status(400).json({
        message: 'session_id와 content는 필수입니다.',
      });
    }

    // 세션 존재 여부 확인
    const [sessionRows] = await db.execute(
      'SELECT id FROM sessions WHERE id = ?',
      [session_id],
    );

    if (sessionRows.length === 0) {
      return res
        .status(404)
        .json({ message: '해당 플레이 기록이 존재하지 않습니다.' });
    }

    // 댓글 INSERT
    const [insertResult] = await db.execute(
      `INSERT INTO comments (session_id, user_id, content, created_at)
       VALUES (?, ?, ?, NOW())`,
      [session_id, user.id, content],
    );

    const insertedId = insertResult.insertId;

    // 방금 저장한 댓글 조회 (api.md 응답 형식 맞추기)
    const [rows] = await db.execute(
      `SELECT id, session_id, user_id, content, created_at
       FROM comments
       WHERE id = ?`,
      [insertedId],
    );

    if (rows.length === 0) {
      return res
        .status(500)
        .json({ message: '댓글을 저장했지만 조회에 실패했습니다.' });
    }

    return res.json({ comment: rows[0] });
  } catch (err) {
    next(err);
  }
};

// 3-2. 댓글 조회 (GET /comments?session_id=10)
exports.getComments = async (req, res, next) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res
        .status(400)
        .json({ message: 'session_id 쿼리스트링은 필수입니다.' });
    }

    const [rows] = await db.execute(
      `
      SELECT
        c.id,
        c.session_id,
        c.user_id,
        u.nickname,
        c.content,
        c.created_at
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.session_id = ?
      ORDER BY c.created_at ASC
      `,
      [session_id],
    );

    return res.json({ comments: rows });
  } catch (err) {
    next(err);
  }
};


// 3-3. 댓글 삭제 (DELETE /comments/:id)
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 해당 댓글 조회
    const [rows] = await db.execute(
      `SELECT user_id FROM comments WHERE id = ?`,
      [commentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    }

    // 본인 여부 확인
    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: '본인이 작성한 댓글만 삭제 가능합니다.' });
    }

    // 삭제 실행
    await db.execute(`DELETE FROM comments WHERE id = ?`, [commentId]);

    return res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

