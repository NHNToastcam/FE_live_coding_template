# 🧪 사용자 관리 UI 구현 과제 (90분)

## 🎯 과제 목표

두 개의 페이지로 구성된 사용자 관리 SPA를 React + TypeScript + Vite + Zustand + React Router를 이용해 구현하세요.

---

## 📦 기술 스택 요구사항

- **React + TypeScript**
- **Vite**
- **Zustand** (상태 관리)
- **React Router v6**
- **CSS 모듈** (`index.module.scss`)
- **Jest + React Testing Library** (기본 테스트 1개 이상)

---

## 🧭 라우팅 구조

| 경로        | 설명                           |
| ----------- | ------------------------------ |
| `/`         | 사용자 목록 + 검색 + 추가 기능 |
| `/user/:id` | 개별 사용자 상세 보기 페이지   |

---

## 📄 요구 기능 상세

### 1. 사용자 목록 페이지 (`/`)

- 사용자 이름, 이메일로 **실시간 검색 가능**
- 사용자 목록을 **Table**로 표시
  - 항목: 이름, 이메일, 가입일, [상세보기], [삭제]
- **상세보기 버튼** 클릭 시 `/user/:id`로 이동
- **삭제 버튼** 클릭 시 해당 사용자 삭제
- **"사용자 추가" 버튼** 클릭 시 **Modal 창**으로 사용자 추가

### 2. 사용자 추가 Modal

- 필드: 이름, 이메일, 가입일 (default: 오늘 날짜)
- 유효성 검사 포함 (이메일 형식, 빈 값 체크)
- 추가 시 상태에 반영되고 목록 갱신

### 3. 사용자 상세 페이지 (`/user/:id`)

- 사용자 ID를 기반으로 정보 조회
- 상태에서 해당 사용자 정보를 찾아 보여줌
- 정보:
  - 이름
  - 이메일
  - 가입일
- 뒤로가기 버튼 (`/`로 이동)

---

## ✅ 보너스 요구사항 (선택)

- 삭제 시 **Confirm Modal** 추가
- Zustand 상태를 **localStorage**에 저장하여 새로고침 유지
- **검색 결과가 없을 경우 빈 상태 UI** 보여주기
- **Skeleton UI 또는 로딩 스피너** 구현
- **반응형 레이아웃** 지원

---

## 🧪 테스트 요구사항

- 사용자 추가 로직에 대한 테스트 1개 이상
- Zustand 상태 로직 테스트 (선택)

---

## 📁 폴더 구조 예시

```
src/
├── components/
│   ├── CustomTable.tsx
│   ├── Modal.tsx
│   ├── SearchInput.tsx
│   └── Spinner.tsx
├── layout/
│   └── DefaultLayout.tsx
│   └── components/
│         └── Header.tsx
│         └── Footer.tsx
├── pages/
│   ├── Home.tsx
│   └── UserDetail.tsx
├── store/
│   └── userStore.ts
├── types/
│   └── user.ts
├── App.tsx
└── main.tsx
```

---

## 🔁 라우터 설정 예시 (`App.tsx`)

```
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import { HomePage } from "./pages/Home";
import { UserDetailPage } from "./pages/UserDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="user/:id" element={<UserDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```
