# Game Log Project API 문서

본 문서는 Game Log 프로젝트에서 사용하는 REST API 명세서입니다.  
프론트엔드와 백엔드가 동일한 규칙으로 통신할 수 있도록,  
모든 엔드포인트·요청 형식·응답 형식을 문서화합니다.

---

# 0. 공통 정보
- Base URL: http://localhost:4000/api
- 모든 Request/Response 형식: application/json
- 인증 방식: 세션(Session) 기반 로그인

---

# 1. 인증(Auth) API [구현 완료]

## 1-1. 회원가입 (POST /auth/signup)
```
Request:
{
  "email": "user@example.com",
  "nickname": "nickname",
  "password": "plain_password"
}

Response 성공:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "nickname",
    "created_at": "2025-12-06T12:34:56.000Z"
  }
}
```

---

## 1-2. 로그인 (POST /auth/login)
```
Request:
{
  "email": "user@example.com",
  "password": "plain_password"
}

Response 성공:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "nickname"
  }
}
```

---

## 1-3. 로그아웃 (POST /auth/logout)
```
Response:
{ "message": "Logged out" }
```

---

## 1-4. 로그인 상태 조회 (GET /auth/me)
```
로그인 시:
{
  "user": { "id": 1, "email": "user@example.com", "nickname": "nickname" }
}

비로그인 시:
{
  "user": null
}
```

---

# 2. 세션(Session) API [구현 완료]

## 2-1. 기록 생성 (POST /sessions)
```
Request:
{
  "game_code": "lol",
  "play_date": "2025-12-08",
  "play_time_minutes": 120,
  "feeling": "오늘 솔랭 3판 함",
  "screenshot_url": "https://example.com/image.png"
}

Response:
{
  "session": {
    "id": 10,
    "user_id": 1,
    "game_code": "lol",
    "play_date": "2025-12-08",
    "play_time_minutes": 120,
    "feeling": "오늘 솔랭 3판 함",
    "screenshot_url": "https://example.com/image.png",
    "created_at": "2025-12-08T12:34:56.000Z"
  }
}
```

---

## 2-2. 내 기록 조회 (GET /sessions/me)
```
Query 옵션:
?from=2025-12-01&to=2025-12-31&game_code=lol

Response:
{
  "sessions": [
    {
      "id": 10,
      "game_code": "lol",
      "play_date": "2025-12-08",
      "play_time_minutes": 120,
      "feeling": "오늘 솔랭 3판 함",
      "screenshot_url": null
    }
  ]
}
```

---

## 2-3. 기록 상세 (GET /sessions/:id)
```
Response:
{
  "session": {
    "id": 10,
    "user_id": 1,
    "game_code": "lol",
    "play_date": "2025-12-08",
    "play_time_minutes": 120,
    "feeling": "오늘 솔랭 3판 함",
    "screenshot_url": null,
    "created_at": "2025-12-08T12:34:56.000Z"
  }
}
```

---

## 2-4. 기록 삭제 (DELETE /sessions/:id)
```
Response:
{ "message": "Session deleted" }
```

---

# 3. 댓글 API [구현 완료]

> 규칙  
> - 댓글 작성/삭제는 로그인 필요  
> - 댓글 삭제는 작성자 본인만 가능  

## 3-1. 댓글 작성 (POST /comments)
```
Request:
{
  "session_id": 10,
  "content": "플레이 잘하셨네요!"
}

Response:
{
  "comment": {
    "id": 5,
    "session_id": 10,
    "user_id": 1,
    "content": "플레이 잘하셨네요!",
    "created_at": "2025-12-08T14:00:00.000Z"
  }
}
```

---

## 3-2. 댓글 조회 (GET /comments?session_id=10)
```
Response:
{
  "comments": [
    {
      "id": 5,
      "session_id": 10,
      "user_id": 1,
      "content": "플레이 잘하셨네요!",
      "created_at": "2025-12-08T14:00:00.000Z"
    }
  ]
}
```

---

## 3-3. 댓글 삭제 (DELETE /comments/:id)
```
설명:
- 로그인 필수
- 작성자 본인만 삭제 가능

Response:
{
  "message": "Comment deleted"
}
```

---

# 4. 팔로우 API [미구현]

## 4-1. 팔로우 (POST /follows/:targetUserId)
```
Response:
{ "message": "Followed" }
```

---

## 4-2. 언팔로우 (DELETE /follows/:targetUserId)
```
Response:
{ "message": "Unfollowed" }
```

---

## 4-3. 내 팔로잉 목록 (GET /follows/me)
```
Response:
{
  "following": [
    { "id": 2, "email": "friend@example.com", "nickname": "친구닉네임" }
  ]
}
```

---

# 5. 통계 API [미구현]

## 5-1. 통계 조회 (GET /stats/me?range=weekly or monthly)
```
Response:
{
  "stats": {
    "total_minutes": 560,
    "by_game": { "lol": 300, "valorant": 260 },
    "daily": [
      { "date": "2025-12-01", "minutes": 120 },
      { "date": "2025-12-02", "minutes": 90 }
    ]
  }
}
```

---

# 6. 규칙
1. API 변경 시 api.md 먼저 수정.
2. 필드명은 문서 기준으로 통일.
3. 모든 API 경로는 /api 하위에 존재.
4. 인증 기반 API는 withCredentials 필요.
