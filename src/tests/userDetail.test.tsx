import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "@/api/user.api";
import { UserDetailPage } from "@/pages/UserDetail";
import "@testing-library/jest-dom";

jest.mock("@/api/user.api");

const user = {
  id: "2",
  name: "박철수",
  email: "chulsoo@example.com",
  role: "editor",
  phone: "010-5555-0000",
  address: "경기도 성남시 분당구 판교로 789",
  createdAt: "2025-02-20T09:10:00.000Z",
};

describe("User Detail Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ID로 사용자 정보를 조회해 렌더링한다", async () => {
    (api.getUserById as jest.Mock).mockResolvedValue(user);

    render(
      <MemoryRouter initialEntries={["/user/2"]}>
        <Routes>
          <Route path="/user/:id" element={<UserDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("박철수")).toBeInTheDocument();
    expect(screen.getByText("chulsoo@example.com")).toBeInTheDocument();
    expect(screen.getByText(/editor/i)).toBeInTheDocument();
    expect(screen.getByText("010-5555-0000")).toBeInTheDocument();
    expect(screen.getByText(/판교로 789/)).toBeInTheDocument();
  });

  test("뒤로가기 버튼을 렌더링한다", async () => {
    (api.getUserById as jest.Mock).mockResolvedValue(user);

    render(
      <MemoryRouter initialEntries={["/user/2"]}>
        <Routes>
          <Route path="/user/:id" element={<UserDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("button", { name: /뒤로가기|목록으로/i })
    ).toBeInTheDocument();
  });
});
