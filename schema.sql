/* -----------------------------
   DATABASE 생성
----------------------------- */
DROP DATABASE IF EXISTS game_log;
CREATE DATABASE game_log
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE game_log;

/* -----------------------------
   USERS (회원 정보)
----------------------------- */
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* -----------------------------
   GAMES (게임 종류)
   - 프로젝트에서는 2개만 사용 (LOL / VALORANT)
----------------------------- */
CREATE TABLE games (
  id TINYINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,   -- 'lol', 'valorant'
  name VARCHAR(50) NOT NULL           -- '리그 오브 레전드', '발로란트'
);

INSERT INTO games (code, name) VALUES
('lol', '리그 오브 레전드'),
('valorant', '발로란트');

/* -----------------------------
   SESSIONS (오늘 한 게임 기록)
----------------------------- */
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id TINYINT NOT NULL,
  play_date DATE NOT NULL,            -- 플레이 날짜
  play_time_minutes INT NOT NULL,     -- 플레이 시간 (분)
  feeling TEXT NOT NULL,              -- 느낀 점
  screenshot_url VARCHAR(500),        -- 스크린샷 URL
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sessions_game
    FOREIGN KEY (game_id) REFERENCES games(id)
    ON DELETE CASCADE
);

/* -----------------------------
   COMMENTS (게임 기록 댓글)
----------------------------- */
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comments_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

/* -----------------------------
   FOLLOWS (팔로우 기능)
----------------------------- */
CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,
  followee_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_follows_follower
    FOREIGN KEY (follower_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_follows_followee
    FOREIGN KEY (followee_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT uniq_follow UNIQUE (follower_id, followee_id)
);

/* -----------------------------
   ✔ 총 정리
   USERS → 회원
   GAMES → 게임 종류 (LOL / VALORANT)
   SESSIONS → 오늘 플레이 기록
   COMMENTS → 기록 댓글
   FOLLOWS → 팔로우
----------------------------- */
