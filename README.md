# Game Log

게임 플레이 시간과 당시의 경험을 기록하고 친구와 공유하는 SNS형 웹 서비스입니다. 리그 오브 레전드와 발로란트 기록을 하나의 피드에서 관리할 수 있도록 만든 웹응용프로그래밍 팀 프로젝트입니다.

## 주요 기능

- **계정과 인증:** 회원가입, 로그인, 로그아웃. 비밀번호는 bcrypt로 해시해 저장하고 Passport의 세션 인증을 사용합니다.
- **게임 기록:** 게임 종류, 날짜, 플레이 시간, 소감을 입력하고 내 기록을 조회·삭제합니다. API는 선택적인 스크린샷 URL도 저장할 수 있습니다.
- **피드와 소셜 기능:** 내 기록과 팔로우한 사용자의 기록을 최신순으로 보여주고, 댓글 작성·삭제와 팔로우·언팔로우를 지원합니다.
- **통계:** 월간 총 플레이 시간, 게임별 시간 비율, 날짜별 플레이 시간을 보여줍니다. 백엔드 통계 API는 주간·월간 조회를 지원합니다.

## 담당 역할

| 담당 | 구현 내용 |
| --- | --- |
| 김예준 · 프론트엔드 | React 화면 구성, 로그인·회원가입, 피드·기록 작성, 댓글·친구·통계 화면, 백엔드 API 연동 |
| 김윤지 · 백엔드 | Express API, Passport 세션 인증, MySQL 데이터 처리 |

프론트엔드 담당 내용은 저장소의 `frontend/src`와 관련 커밋에서 확인할 수 있습니다. 이 저장소는 팀 프로젝트이며 백엔드 전체를 개인 구현물로 주장하지 않습니다.

## 기술 스택

- **프론트엔드:** React, React Router, React-Bootstrap, Axios
- **백엔드:** Node.js, Express, Passport, express-session
- **데이터베이스:** MySQL (`mysql2`)

## 프로젝트 구조

```text
backend/               Express API, 인증, MySQL 연동
frontend/src/pages/     로그인, 회원가입, 피드, 기록 작성, 친구, 통계 화면
frontend/src/components/ 내비게이션 바와 댓글 컴포넌트
schema.sql             MySQL 스키마와 초기 게임 데이터
api.md                 REST API 명세
```

## 로컬 실행

Node.js, npm, MySQL이 필요합니다. 이 저장소의 프론트엔드는 `http://localhost:3000`, 백엔드는 `http://localhost:4000`에서 실행하도록 설정되어 있습니다.

1. MySQL에 `schema.sql`을 실행합니다. **이 스크립트는 기존 `game_log` 데이터베이스를 삭제하고 다시 만듭니다.**
2. `backend/.env`를 만들고 로컬 DB 정보와 세션 비밀값을 입력합니다.

   ```dotenv
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-local-password
   DB_DATABASE=game_log
   COOKIE_SECRET=replace-with-a-random-secret
   ```

3. 저장소 루트에서 각각의 의존성을 설치합니다.

   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

4. 터미널 두 개에서 백엔드와 프론트엔드를 각각 실행합니다.

   ```bash
   npm start --prefix backend
   ```

   ```bash
   npm start --prefix frontend
   ```

백엔드의 DB 연결은 `backend/models/index.js`에서 환경변수를 읽습니다. 로그인 후 피드, 기록, 친구, 통계 화면을 확인할 수 있습니다. API 경로와 요청·응답 형식은 [api.md](api.md)에 정리되어 있습니다.

## 현재 공개 코드의 범위

- 배포된 서비스 주소는 없으며 로컬 실행을 기준으로 작성되었습니다.
- 통계 화면은 API 요청에 실패하면 임시 예시 데이터를 표시하는 분기가 남아 있습니다. 실제 통계를 확인할 때는 백엔드와 DB 연결 상태를 먼저 확인해야 합니다.
- 이 저장소에는 루트 통합 실행용 `package.json`이 없습니다. 백엔드와 프론트엔드를 위 명령처럼 각각 실행합니다.
