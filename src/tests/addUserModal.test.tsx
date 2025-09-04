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
    age: 25,
    createdAt: "2025-01-15T15:30:00.000Z",
  },
  {
    id: "2",
    name: "박철수",
    email: "chulsoo@example.com",
    role: "editor",
    phone: "010-5555-0000",
    age: 35,
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
      age: 25,
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
        age: "서울시 강남구",
      });
    });

    // 목록 갱신에 새 유저가 보임
    expect(await screen.findByText("홍길동")).toBeInTheDocument();

    jest.useRealTimers();
  });

  test("❌ 필수값 비워두면: '추가' 클릭해도 addUser가 호출되지 않는다", async () => {
    jest.useFakeTimers();
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);
    (api.addUser as jest.Mock).mockResolvedValue({}); // 호출되면 안 됨

    renderHome();
    await screen.findByText("이지은");

    // 모달 열기
    fireEvent.click(screen.getByRole("button", { name: /사용자 추가/i }));
    await act(async () => {
      jest.advanceTimersByTime(20);
    });

    const dialog = await screen.findByRole("dialog");

    // 일부만 입력 (이름만 입력)
    fireEvent.change(within(dialog).getByLabelText("이름"), {
      target: { value: "홍길동" },
    });

    // 구현에 따라 '추가' 비활성일 수 있음. 비활성이라면 클릭이 안 되므로 그대로 OK
    const addBtn = within(dialog).getByRole("button", { name: /^추가$/ });

    // 비활성 우선 검사
    if (
      addBtn.hasAttribute("disabled") ||
      (addBtn as HTMLButtonElement).disabled
    ) {
      // 비활성 상태라면 클릭 시도 없이 addUser가 호출되지 않았음을 보장
      expect(api.addUser).not.toHaveBeenCalled();
    } else {
      // 혹시 활성이라도, 클릭해도 addUser가 절대 호출되면 안 된다
      await act(async () => {
        fireEvent.click(addBtn);
        jest.advanceTimersByTime(100);
      });
      expect(api.addUser).not.toHaveBeenCalled();
    }

    // (선택) 에러 메시지 강제: 구현에서 에러 문구를 반드시 보여주게 했다면 이 중 하나 매칭되도록 강하게 체크
    const emailError = within(dialog).queryByText(
      /이메일.*필수|이메일.*입력|email.*required/i
    );
    const phoneError = within(dialog).queryByText(
      /전화.*필수|전화.*입력|phone.*required/i
    );
    const addrError = within(dialog).queryByText(
      /주소.*필수|주소.*입력|age.*required/i
    );
    // 최소 하나는 떠야 하게 강제하려면:
    expect(emailError || phoneError || addrError).toBeTruthy();

    jest.useRealTimers();
  });

  test("❌ 이메일 형식이 잘못되면: '추가' 클릭해도 addUser가 호출되지 않는다", async () => {
    jest.useFakeTimers();
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);
    (api.addUser as jest.Mock).mockResolvedValue({}); // 호출되면 안 됨

    renderHome();
    await screen.findByText("이지은");

    fireEvent.click(screen.getByRole("button", { name: /사용자 추가/i }));
    await act(async () => {
      jest.advanceTimersByTime(20);
    });

    const dialog = await screen.findByRole("dialog");

    // 모든 필수값 입력하되 이메일만 잘못된 형식
    fireEvent.change(within(dialog).getByLabelText("이름"), {
      target: { value: "홍길동" },
    });
    fireEvent.change(within(dialog).getByLabelText("이메일"), {
      target: { value: "not-an-email" },
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

    const addBtn = within(dialog).getByRole("button", { name: /^추가$/ });

    // 버튼이 비활성이어야 이상적이지만, 혹시 활성이어도 클릭 시 addUser 호출되면 안 됨
    await act(async () => {
      fireEvent.click(addBtn);
      jest.advanceTimersByTime(100);
    });
    expect(api.addUser).not.toHaveBeenCalled();

    // 에러 메시지는 반드시 떠야 통과 (강제)
    expect(
      within(dialog).getByText(/이메일.*형식|유효한 이메일|invalid email/i)
    ).toBeInTheDocument();

    jest.useRealTimers();
  });
});
