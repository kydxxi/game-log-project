# Game Log 프론트엔드

Game Log의 React 클라이언트입니다. 게임 기록을 작성하고 친구의 기록을 피드에서 확인하는 화면을 구현했습니다. 프로젝트 개요, 팀 역할, DB 설정은 [루트 README](../README.md)를 참고하세요.

## 화면과 기능

- 로그인·회원가입: Passport 세션 인증 API와 연동
- 피드: 내 기록과 팔로우한 사용자의 기록 조회, 내 기록 삭제, 댓글 표시
- 기록 작성: 게임 종류·날짜·플레이 시간·소감 입력
- 친구: 팔로우·언팔로우, 팔로잉·팔로워 목록
- 통계: 월간 총 플레이 시간, 게임별 비율, 날짜별 기록 표시

주요 화면은 `src/pages/`, 공통 내비게이션과 댓글 UI는 `src/components/`에 있습니다. React, React Router, React-Bootstrap, Axios를 사용합니다.

## 로컬 실행

루트 README의 안내에 따라 MySQL과 백엔드를 먼저 실행한 뒤, 저장소 루트에서 다음 명령을 실행합니다.

```bash
npm install --prefix frontend
npm start --prefix frontend
```

브라우저에서 `http://localhost:3000`을 엽니다. `src/api.js`는 로컬 백엔드 `http://localhost:4000/api`를 호출하며 세션 쿠키를 포함합니다.

## 현재 코드의 주의사항

통계 화면은 API 요청에 실패하면 임시 예시 데이터를 표시합니다. 실제 통계를 확인하려면 백엔드와 DB가 정상 실행 중인지 확인해야 합니다.
