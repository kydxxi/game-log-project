# Game Log Project

본 프로젝트는 라이엇 게임(리그 오브 레전드, 발로란트)의 플레이 기록을 저장하고,  
사용자의 활동 통계 및 기본적인 소셜 기능(댓글, 팔로우)을 제공하는 웹 서비스입니다.

백엔드는 Node.js + Express 기반으로 구현되며,  
사용자 인증은 Passport(Local Strategy)와 세션 기반 로그인으로 구성됩니다.  
전체 REST API 명세는 아래 파일 참고:  
 -> [api.md](./api.md)

---

## 1. 주요 기능

### 1) 인증(Authentication)

- 회원가입
- 로그인 / 로그아웃
- 로그인 상태 확인

### 2) 게임 기록(Game Sessions)

- 플레이 기록 작성
- 날짜, 플레이 시간, 느낀점, 스크린샷 URL 저장
- 기록 목록 조회
- 기록 상세 조회
- 기록 삭제

### 3) 댓글 기능(Comments)

- 게임 기록에 대한 댓글 작성
- 댓글 조회
- 댓글 삭제

### 4) 팔로우 기능(Follow)

- 사용자 팔로우
- 팔로우 취소
- 팔로워 목록 조회
- 팔로잉 목록 조회

### 5) 통계 기능(Statistics)

- 총 플레이 시간 조회
- 게임별 플레이 시간 비율
- 주간 및 월간 통계 제공

---

## 2. 기술 스택

### Backend

- Node.js
- Express.js
- Passport(Local Strategy)
- express-session
- MySQL (mysql2)
- bcrypt
- cors
- dotenv
- morgan

### Frontend

- React (추후 개발 예정)

---

## 3. 폴더 구조

```
game-log-project/
 ├─ backend/
 │    ├─ app.js
 │    ├─ config/
 │    ├─ controllers/
 │    ├─ middlewares/
 │    ├─ models/
 │    ├─ passport/
 │    └─ routes/
 │
 ├─ frontend/
 │
 ├─ schema.sql
 ├─ api.md
 └─ README.md
```

---

## 4. Backend 실행 방법

### (1) 의존성 설치

```
cd backend
npm install
```

### (2) 서버 실행

```
npm start
```

### (3) 서버 기본 주소

```
http://localhost:4000
```

---

## 5. Database 설정

### (1) MySQL에서 아래 명령어로 스키마 생성

```
SOURCE schema.sql;
```

### (2) 생성되는 주요 테이블

- users
- games
- sessions
- comments
- follows

---

## 6. 주의사항 및 참고 사항

- 프론트엔드에서 요청 시 `credentials: "include"` 설정 필수  
  (세션 기반 인증을 위한 쿠키 포함)
- CORS는 기본적으로 `http://localhost:3000` 기준
- 세션 기반 인증을 사용하므로 브라우저 쿠키 필요

---

## 7. 환경 변수 (.env)

backend/.env 파일을 생성하고 아래 값 입력:

```
COOKIE_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_DATABASE=game_log
```

---

## 8. 팀 구성

- Backend : 202355705 김윤지
- Frontend : 202255527 김예준

---
