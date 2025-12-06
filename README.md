#  Game Log Project
라이엇 게임(롤/발로란트)의 플레이 기록을 저장하고,  
통계, 댓글, 팔로우 기능을 제공하는 웹 서비스입니다.

백엔드는 Node.js + Express + Passport(Local) 기반이며  
프론트엔드는 React로 구성됩니다.

---

##  Features

###  Authentication
- 회원가입 / 로그인 / 로그아웃
- Passport(Local) + Express-Session 기반

###  Game Sessions
- 게임 기록 작성
- 플레이 시간, 날짜, 느낀점, 스크린샷 URL 저장
- 자신의 기록 목록 조회
- 상세 조회 / 삭제

###  Comments
- 각 게임 기록에 댓글 작성

###  Follow
- 유저 팔로우 / 언팔로우
- 팔로워 / 팔로잉 목록 조회

###  Stats
- 총 플레이 시간
- 게임별 시간 비율
- 주간 / 월간 통계

---

##  Tech Stack

### Backend
- Node.js
- Express.js
- Passport(Local)  
- Express-Session  
- MySQL (mysql2)
- bcrypt
- CORS
- dotenv
- morgan

### Frontend
- React (예정)

---

##  Folder Structure

```
game-log-project/
 ├─ backend/
 │    ├─ app.js
 │    ├─ config/
 │    │     └─ config.json
 │    ├─ controllers/
 │    ├─ middlewares/
 │    ├─ models/
 │    ├─ passport/
 │    ├─ routes/
 │    └─ package.json
 │
 ├─ frontend/
 │
 └─ schema.sql
```

---

##  Backend Installation & Run

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Run server

```bash
npm start
```

### 3) Server runs on:

```
http://localhost:4000
```

---

##  Database Setup

MySQL에서 다음 실행:

```sql
SOURCE docs/schema.sql;
```

또는 수동으로:

1. `game_log` DB 생성  
2. `users`, `games`, `sessions`, `comments`, `follows` 테이블 생성  
→ docs/schema.sql 참고

---

##  API Documentation

모든 API 명세는 아래 문서 참고:

➡ **docs/api.md**

---

## Team

- Backend: 202355705 김윤지  
- Frontend: 김예준

---

##  Notes

- 프론트 fetch 요청 시 `credentials: 'include'` 필수  
- CORS는 `http://localhost:3000` 기준 설정됨  
- Passport의 세션 방식이므로 브라우저 쿠키 필요

---

##  END

이 README는 텀프로젝트 제출용 + 팀 협업용으로 작성되었습니다.
