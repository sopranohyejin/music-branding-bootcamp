# 음악인 브랜딩 부트캠프

## 실행 방법

### 방법 1 — 더블클릭 (가장 쉬움)

프로젝트 루트의 **`시작.bat`** 파일을 더블클릭하면:
1. 개발 서버 자동 실행
2. 5초 후 브라우저에서 `http://localhost:3000/branding-bootcamp?participantId=p001` 자동 오픈

---

### 방법 2 — VS Code 터미널

```
npm run dev
```

`✓ Ready in ...` 메시지가 뜨면 아래 주소로 접속합니다.

---

## 접속 주소

| 용도 | 주소 |
|------|------|
| 참가자 p001 (김혜민) | http://localhost:3000/branding-bootcamp?participantId=p001 |
| 참가자 p002 | http://localhost:3000/branding-bootcamp?participantId=p002 |
| 참가자 p003 | http://localhost:3000/branding-bootcamp?participantId=p003 |
| ... ~ p050까지 지원 | http://localhost:3000/branding-bootcamp?participantId=p050 |
| 관리자 페이지 | http://localhost:3000/branding-bootcamp/admin |

---

## 참가자 이름 변경

[src/lib/brandingBootcamp.ts](src/lib/brandingBootcamp.ts) 파일의 `MOCK_PARTICIPANTS` 배열에서 수정:

```ts
export const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p001', name: '김혜민', ... },  // ← 이름 수정
  { id: 'p002', name: '홍길동', ... },
  ...
];
```

---

## 미션 공개 날짜 변경

[src/lib/brandingBootcamp.ts](src/lib/brandingBootcamp.ts) 파일의 `WEEKS` 배열에서 날짜 수정:

```ts
releaseDate: '2026-10-05T00:00:00+09:00',  // 이 날짜 이후부터 미션 공개
lectureDate: '2026-10-05T21:00:00+09:00',  // 카운트다운 기준 강의 시간
```

---

## 주의사항 (MVP 한계)

현재 버전은 **localStorage 기반**입니다.
- 각 참가자 데이터가 해당 참가자의 브라우저에만 저장됩니다.
- 관리자 페이지에서 다른 기기 참가자의 답변을 볼 수 없습니다.
- 실제 운영 전에 Supabase 또는 Firebase DB 연결이 필요합니다.
