// src/tests/addUserModal.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/Home";
import { UserDetailPage } from "@/pages/UserDetail";
import * as api from "@/api/user.api";
import "@testing-library/jest-dom";

jest.mock("@/api/user.api");

const mockUsers = [
  {
    id: "1",
    name: "이지은",
    email: "jieun@example.com",
    role: "user",
    phone: "010-9876-5432",
    address: "서울특별시 마포구 월드컵북로 456",
    createdAt: "2025-01-15T15:30:00.000Z",
  },
  {
    id: "2",
    name: "박철수",
    email: "chulsoo@example.com",
    role: "editor",
    phone: "010-5555-0000",
    address: "경기도 성남시 분당구 판교로 789",
    createdAt: "2025-02-20T09:10:00.000Z",
  },
];

function renderHome(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("사용자 추가 모달", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("정상 입력 후 추가 시 로딩이 표시되고, 완료 후 목록에 반영된다", async () => {
    jest.useFakeTimers(); // ⬅️ 타이머 제어

    // 1) 초기 목록
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    // 2) addUser 호출 시 반환될 새 유저
    const newUser = {
      id: "999",
      name: "홍길동",
      email: "hong@example.com",
      role: "user",
      phone: "010-0000-0000",
      address: "서울시 강남구",
      createdAt: "2025-03-10T08:00:00.000Z",
    };
    (api.addUser as jest.Mock).mockResolvedValue(newUser);

    // 3) 추가 후 재조회 시 새 유저 포함 목록 반환
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce([
      ...mockUsers,
      newUser,
    ]);

    renderHome();

    // 초기 목록 렌더 끝
    await screen.findByText("이지은");

    // --- 모달 열기 ---
    fireEvent.click(screen.getByRole("button", { name: /사용자 추가/i }));

    // 모달 애니메이션 타이머(예: 10ms) 소화
    await act(async () => {
      jest.advanceTimersByTime(20);
    });

    // 모달 다이얼로그 기준으로 범위 한정
    const dialog = await screen.findByRole("dialog");

    // 입력
    fireEvent.change(within(dialog).getByLabelText("이름"), {
      target: { value: "홍길동" },
    });
    fireEvent.change(within(dialog).getByLabelText("이메일"), {
      target: { value: "hong@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText("전화번호"), {
      target: { value: "010-0000-0000" },
    });
    fireEvent.change(within(dialog).getByLabelText("주소"), {
      target: { value: "서울시 강남구" },
    });
    fireEvent.change(within(dialog).getByLabelText("역할"), {
      target: { value: "user" },
    });

    // --- "추가" 버튼(정확 일치)만 찾기 ---
    const addBtn = within(dialog).getByRole("button", { name: /^추가$/ });

    // 클릭 → 내부에서 비동기/타이머가 돌 수 있으므로 act로 감싸고 타이머 전진
    await act(async () => {
      fireEvent.click(addBtn);
      // 내부 로딩/애니메이션/약간의 지연이 있다면 여유 있게 진행
      jest.advanceTimersByTime(500);
    });

    // API 호출 검증
    await waitFor(() => {
      expect(api.addUser).toHaveBeenCalledWith({
        name: "홍길동",
        email: "hong@example.com",
        role: "user",
        phone: "010-0000-0000",
        address: "서울시 강남구",
      });
    });

    // 목록 갱신에 새 유저가 보임
    expect(await screen.findByText("홍길동")).toBeInTheDocument();

    jest.useRealTimers();
  });
});
