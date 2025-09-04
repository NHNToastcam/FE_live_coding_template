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

describe("Home Page - 사용자 목록/검색/추가/삭제/모달", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("초기 로딩 시 스피너가 보이고, 데이터 렌더링 후 사라진다", async () => {
    (api.fetchUsers as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 300))
    );

    renderHome();

    // 로딩 스피너
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // 데이터 렌더링 후 스피너 사라짐
    expect(await screen.findByText("이지은")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  test("테이블 컬럼과 데이터가 표시된다 (이름/이메일/전화/주소/가입일)", async () => {
    (api.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    renderHome();

    // 컬럼 헤더
    expect(await screen.findByText("이름")).toBeInTheDocument();
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("전화번호")).toBeInTheDocument();
    expect(screen.getByText("주소")).toBeInTheDocument();
    expect(screen.getByText("가입일")).toBeInTheDocument();

    // 데이터 일부
    expect(screen.getByText("jieun@example.com")).toBeInTheDocument();
    expect(screen.getByText("010-5555-0000")).toBeInTheDocument();
  });

  test("실시간 검색(debounce)으로 이름/이메일 필터링된다", async () => {
    jest.useFakeTimers();
    (api.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    (api.searchUsersByName as jest.Mock).mockResolvedValue([mockUsers[1]]); // 박철수만

    renderHome();

    await screen.findByText("이지은"); // 초기 데이터 로드 완료

    const searchInput = screen.getByPlaceholderText(/검색/i);
    fireEvent.change(searchInput, { target: { value: "chulsoo" } });

    // 디바운스 300ms 진행
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    // 필터링 결과
    expect(await screen.findByText("박철수")).toBeInTheDocument();
    expect(screen.queryByText("이지은")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  test("상세보기 버튼 클릭 시 /user/:id 로 이동한다", async () => {
    (api.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    // 상세 페이지도 같은 사용자 반환하도록 모킹
    (api.getUserById as jest.Mock).mockImplementation(async (id: string) => {
      return mockUsers.find((u) => u.id === id) ?? null;
    });

    renderHome();

    const rowName = await screen.findByText("이지은");
    const rowEl = rowName.closest("tr")!;
    const detailBtn = within(rowEl).getByRole("button", { name: /상세보기/i });
    fireEvent.click(detailBtn);

    // 상세 페이지에서 사용자 정보 확인 (제목 또는 이름)
    // 프로젝트에 실제 있는 텍스트로 맞춰도 됨
    // expect(await screen.findByText(/사용자 상세/i)).toBeInTheDocument();
    expect(await screen.findByText("이지은")).toBeInTheDocument();
  });

  test("삭제 버튼 클릭 시 사용자 삭제된다 (window.confirm 모킹)", async () => {
    (api.fetchUsers as jest.Mock)
      .mockResolvedValueOnce(mockUsers) // 초기 목록
      .mockResolvedValueOnce([mockUsers[0]]); // 재조회 시 박철수 제외

    (api.deleteUser as jest.Mock).mockResolvedValue({ ok: true });
    jest.spyOn(window, "confirm").mockReturnValue(true);

    renderHome();

    const row = await screen.findByText("박철수");
    const rowEl = row.closest("tr")!;
    fireEvent.click(within(rowEl).getByRole("button", { name: /삭제/i }));

    await waitFor(() => {
      expect(api.deleteUser).toHaveBeenCalledWith("2");
      expect(screen.queryByText("박철수")).not.toBeInTheDocument();
    });
  });

  test("사용자 추가 버튼 클릭 시 모달이 열린다", async () => {
    (api.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    renderHome();

    await screen.findByText("이지은");

    fireEvent.click(screen.getByRole("button", { name: /사용자 추가/i }));
    // 모달 타이틀
    expect(screen.getByText("유저 추가")).toBeInTheDocument();
  });

  test("검색 결과가 없으면 빈 상태 UI가 보인다", async () => {
    (api.fetchUsers as jest.Mock).mockResolvedValue([]);
    renderHome();

    // empty state
    expect(
      await screen.findByText(/데이터가 없습니다|검색 결과가 없습니다/i)
    ).toBeInTheDocument();
  });
});
