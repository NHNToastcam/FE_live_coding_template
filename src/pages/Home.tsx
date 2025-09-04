import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable, { type ColumnProps } from "@/components/CustomTable";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import {
  fetchUsers,
  addUser,
  deleteUser,
  searchUsersByName,
} from "@/api/user.api";
import type { User } from "@/types/user";
import SearchInput from "@/components/SearchInput";
import { debounce } from "lodash";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

type NewUser = Omit<User, "id" | "createdAt">;

export function HomePage() {
  const navigate = useNavigate();

  // 목록/검색 상태
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  // 추가 모달 상태
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<NewUser>({
    name: "",
    email: "",
    role: "user",
    phone: "",
    age: "",
  });

  // 초기 로드
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      try {
        const users = await fetchUsers();
        if (mounted) setData(users);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  // 검색 디바운스 (이름/이메일 -> 현재 API는 이름만, 예시는 이름 기준)
  useEffect(() => {
    const id = setTimeout(async () => {
      if (!query.trim()) {
        const users = await fetchUsers();
        setData(users);
        return;
      }
      const filtered = await searchUsersByName(query.trim());
      setData(filtered);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const onChangeForm =
    (name: keyof NewUser) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [name]: e.target.value }));
    };

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      EMAIL_RE.test(form.email) &&
      form.phone.trim().length > 0 &&
      form.age.trim().length > 0 &&
      ["user", "editor", "admin"].includes(form.role)
    );
  }, [form]);

  const doAdd = useCallback(async () => {
    if (!isValid) return;
    setIsAdding(true);
    try {
      const created = await addUser(form);

      setData((prev) => [...prev, created]);
      setIsOpen(false);
      setForm({
        name: "",
        email: "",
        role: "user",
        phone: "",
        age: "",
      });
    } finally {
      setIsAdding(false);
    }
  }, [isValid, form, setData, setIsOpen]);

  const debouncedAdd = useMemo(
    () =>
      debounce(() => {
        void doAdd();
      }, 300),
    [doAdd]
  );

  // 컴포넌트 언마운트/변경 시 디바운스 취소
  useEffect(() => {
    return () => debouncedAdd.cancel();
  }, [debouncedAdd]);

  // 버튼에서 호출할 함수
  const onAddUser = useCallback(() => {
    if (!isValid || isAdding) return; // 유효하지 않거나 현재 추가 중이면 무시
    debouncedAdd();
  }, [isValid, isAdding, debouncedAdd]);

  const onClickDetail = (id: string) => {
    navigate(`/user/${id}`);
  };

  const onClickDelete = async (id: string) => {
    // 보너스 요구사항: Confirm Modal 대신 일단 브라우저 confirm으로 간단히 처리
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    const res = await deleteUser(id);
    if (res.success) {
      setData((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const columns: ColumnProps<User>[] = [
    { key: "name", header: "이름", width: 160 },
    { key: "email", header: "이메일", width: 220 },
    { key: "phone", header: "전화번호", width: 140 },
    { key: "age", header: "나이", width: 260 },
    {
      key: "role",
      header: "역할",
      width: 100,
      format: (v) => String(v).toUpperCase(),
    },
    {
      key: "createdAt",
      header: "가입일",
      width: 180,
      format: (v) => new Date(String(v)).toLocaleString(),
    },
    {
      key: "id",
      header: "액션",
      width: 180,
      render: (item) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onClickDetail(item.id)}>상세보기</button>
          <button onClick={() => onClickDelete(item.id)}>삭제</button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>사용자 목록</h1>

      <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
        <SearchInput
          placeholder="검색 (이름)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="검색"
        />
        <button onClick={() => setIsOpen(true)}>사용자 추가</button>
      </div>

      {isLoading ? (
        <div style={{ padding: 24 }}>
          <Spinner width={24} height={24} data-testid="spinner" />
        </div>
      ) : (
        <CustomTable<User>
          data={data}
          columns={columns}
          rowKey="id"
          isLoading={false}
          emptyText={query ? "검색 결과가 없습니다." : "데이터가 없습니다."}
        />
      )}

      <Modal
        isOpen={isOpen}
        onCloseModal={() => setIsOpen(false)}
        title="유저 추가"
        hasCloseBtn
      >
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            <div>이름</div>
            <input
              value={form.name}
              onChange={onChangeForm("name")}
              placeholder="이름을 입력하세요"
              aria-label="이름"
              required
              disabled={isAdding}
            />
            {!form.name.trim() && (
              <p role="alert" style={{ color: "crimson", marginTop: 4 }}>
                이름을 입력하세요
              </p>
            )}
          </label>

          <label>
            <div>이메일</div>
            <input
              value={form.email}
              onChange={onChangeForm("email")}
              placeholder="이메일을 입력하세요"
              aria-label="이메일"
              type="email"
              required
              disabled={isAdding}
            />
            {form.email && !EMAIL_RE.test(form.email) && (
              <p role="alert" style={{ color: "crimson", marginTop: 4 }}>
                유효한 이메일 형식이 아닙니다
              </p>
            )}
          </label>

          <label>
            <div>전화번호</div>
            <input
              value={form.phone}
              onChange={onChangeForm("phone")}
              placeholder="전화번호를 입력하세요"
              aria-label="전화번호"
              required
              disabled={isAdding}
            />
            {!form.phone.trim() && (
              <p role="alert" style={{ color: "crimson", marginTop: 4 }}>
                전화번호를 입력하세요
              </p>
            )}
          </label>

          <label>
            <div>나이</div>
            <input
              value={form.age}
              onChange={onChangeForm("age")}
              placeholder="주소를 입력하세요"
              aria-label="나이"
              required
              disabled={isAdding}
            />
            {!form.age.trim() && (
              <p role="alert" style={{ color: "crimson", marginTop: 4 }}>
                주소를 입력하세요
              </p>
            )}
          </label>

          <label>
            <div>역할</div>
            <select
              value={form.role}
              onChange={onChangeForm("role")}
              aria-label="역할"
              required
              disabled={isAdding}
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            {!["user", "editor", "admin"].includes(form.role) && (
              <p role="alert" style={{ color: "crimson", marginTop: 4 }}>
                역할을 선택하세요
              </p>
            )}
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              aria-label="추가"
              onClick={onAddUser}
              disabled={!isValid || isAdding}
            >
              {isAdding ? "추가 중..." : "추가"}
            </button>
            <button
              aria-label="cancel-add-user"
              onClick={() => setIsOpen(false)}
              disabled={isAdding}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
