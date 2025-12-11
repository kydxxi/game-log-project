const db = require('../models');

// 기간 계산 헬퍼
function getDateRange(range) {
  const today = new Date();
  const end = today.toISOString().slice(0, 10); // yyyy-mm-dd

  const startDate = new Date(today);

  if (range === 'weekly') {
    startDate.setDate(today.getDate() - 6); // 오늘 포함 7일
  } else if (range === 'monthly') {
    startDate.setMonth(today.getMonth() - 1); // 1달 전
  } else {
    return null;
  }

  const start = startDate.toISOString().slice(0, 10);
  return { start, end };
}

exports.getMyStats = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { range } = req.query;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const dateRange = getDateRange(range);

    if (!dateRange) {
      return res.status(400).json({ message: 'range는 weekly 또는 monthly만 가능합니다.' });
    }

    const { start, end } = dateRange;

    // 1️⃣ 총 시간
    const [totalRows] = await db.execute(
      `
      SELECT SUM(play_time_minutes) AS total
      FROM sessions
      WHERE user_id = ?
        AND play_date BETWEEN ? AND ?
      `,
      [userId, start, end]
    );

    const totalMinutes = totalRows[0].total || 0;

    // 2️⃣ 게임별 시간
    const [gameRows] = await db.execute(
      `
      SELECT g.code, SUM(s.play_time_minutes) AS minutes
      FROM sessions s
      JOIN games g ON s.game_id = g.id
      WHERE s.user_id = ?
        AND s.play_date BETWEEN ? AND ?
      GROUP BY g.code
      `,
      [userId, start, end]
    );

    const byGame = {};
    for (const row of gameRows) {
      byGame[row.code] = row.minutes;
    }

    // 3️⃣ 날짜별 시간 (daily)
    const [dailyRows] = await db.execute(
      `
      SELECT play_date AS date, SUM(play_time_minutes) AS minutes
      FROM sessions
      WHERE user_id = ?
        AND play_date BETWEEN ? AND ?
      GROUP BY play_date
      ORDER BY play_date ASC
      `,
      [userId, start, end]
    );

    return res.json({
      stats: {
        total_minutes: totalMinutes,
        by_game: byGame,
        daily: dailyRows
      }
    });
  } catch (err) {
    next(err);
  }
};
