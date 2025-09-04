// export function UserDetailPage() {
//   return <div>UserDetailPage</div>;
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { getUserById } from "@/api/user.api";
import type { User } from "@/types/user";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const res = await getUserById(id);
        if (mounted) setUser(res);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Spinner width={24} height={24} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <p>사용자를 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/")}>목록으로</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>사용자 상세</h1>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <div>
          <strong>이름:</strong> {user.name}
        </div>
        <div>
          <strong>이메일:</strong> {user.email}
        </div>
        <div>
          <strong>전화번호:</strong> {user.phone}
        </div>
        <div>
          <strong>나이:</strong> {user.age}
        </div>
        <div>
          <strong>역할:</strong> {user.role}
        </div>
        <div>
          <strong>가입일:</strong> {new Date(user.createdAt).toLocaleString()}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => navigate("/")}>목록으로</button>
      </div>
    </div>
  );
}
