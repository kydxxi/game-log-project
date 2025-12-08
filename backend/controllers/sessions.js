const db = require(process.cwd() + '/models');

/**
 * POST /api/sessions
 * 오늘 게임 기록 생성
 */
exports.createSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      game_code,
      play_date,
      play_time_minutes,
      feeling,
      screenshot_url,
    } = req.body;

    if (!game_code || !play_date || !play_time_minutes || !feeling) {
      return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
    }

    const [games] = await db.execute(
      'SELECT id FROM games WHERE code = ?',
      [game_code]
    );

    if (games.length === 0) {
      return res.status(400).json({ message: '존재하지 않는 게임 코드입니다.' });
    }

    const gameId = games[0].id;

    const [result] = await db.execute(
      `INSERT INTO sessions
       (user_id, game_id, play_date, play_time_minutes, feeling, screenshot_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        gameId,
        play_date,
        play_time_minutes,
        feeling,
        screenshot_url || null,
      ]
    );

    const insertedId = result.insertId;

    const [rows] = await db.execute(
      `SELECT
         s.id,
         s.user_id,
         g.code AS game_code,
         s.play_date,
         s.play_time_minutes,
         s.feeling,
         s.screenshot_url,
         s.created_at
       FROM sessions s
       JOIN games g ON s.game_id = g.id
       WHERE s.id = ?`,
      [insertedId]
    );

    const session = rows[0];

    return res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 * GET /api/sessions/me
 * 내 기록 목록 조회
 */
exports.getMySessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { from, to, game_code } = req.query;

    let sql = `
      SELECT
        s.id,
        g.code AS game_code,
        s.play_date,
        s.play_time_minutes,
        s.feeling,
        s.screenshot_url,
        s.created_at
      FROM sessions s
      JOIN games g ON s.game_id = g.id
      WHERE s.user_id = ?
    `;
    const params = [userId];

    if (from) {
      sql += ' AND s.play_date >= ?';
      params.push(from);
    }

    if (to) {
      sql += ' AND s.play_date <= ?';
      params.push(to);
    }

    if (game_code) {
      sql += ' AND g.code = ?';
      params.push(game_code);
    }

    sql += ' ORDER BY s.play_date DESC, s.id DESC';

    const [rows] = await db.execute(sql, params);

    return res.status(200).json({ sessions: rows });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 * GET /api/sessions/:id
 * 기록 상세 조회 (본인 기록만)
 */
exports.getSessionDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    const [rows] = await db.execute(
      `SELECT
         s.id,
         s.user_id,
         g.code AS game_code,
         s.play_date,
         s.play_time_minutes,
         s.feeling,
         s.screenshot_url,
         s.created_at
       FROM sessions s
       JOIN games g ON s.game_id = g.id
       WHERE s.id = ? AND s.user_id = ?`,
      [sessionId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = rows[0];
    return res.status(200).json({ session });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/**
 * DELETE /api/sessions/:id
 * 기록 삭제 (본인 기록만)
 */
exports.deleteSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    // 먼저 본인 기록인지 확인
    const [rows] = await db.execute(
      'SELECT id FROM sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'Not allowed or session not found' });
    }

    // 삭제
    await db.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);

    return res.status(200).json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

