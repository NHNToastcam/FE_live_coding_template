// src/api/user.api.ts
import seed from "@/data/mockUser.json";
import type { User } from "@/types/user";

/** JSON 파일을 DB라고 보고, 모듈 로드 시 1회 초기화 */
type DBShape = { users: User[] };

// 직렬화 경계(네트워크/DB)를 흉내 내기 위한 유틸
const deepClone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 실제 DB 테이블처럼 동작할 in-memory 저장소 (json을 원천으로 사용) */
const DB: DBShape = {
  users: deepClone(seed), // ← JSON을 그대로 “DB”로 복사
};

/* GET: 전체 유저 조회 — 항상 직렬화 복사본을 반환 */
export async function fetchUsers(): Promise<User[]> {
  await sleep(300);
  return deepClone(DB.users);
}

/* POST: 유저 추가 — DB에 insert, 반환도 복사본 */
export async function addUser(
  user: Omit<User, "id" | "createdAt">
): Promise<User> {
  await sleep(300);
  const newUser: User = {
    ...user,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  DB.users.push(newUser); // DB 변경
  return deepClone(newUser); // 직렬화 경계 통과
}

/* GET: 이름/이메일로 검색 — DB에서 select, 복사본 반환 */
export async function searchUsersByName(keyword: string): Promise<User[]> {
  await sleep(300);
  const k = keyword.trim().toLowerCase();
  const result = DB.users.filter(
    (u) => u.name.toLowerCase().includes(k) || u.email.toLowerCase().includes(k)
  );
  return deepClone(result);
}

/* DELETE: 유저 삭제 — DB에서 delete */
export async function deleteUser(id: string): Promise<{ success: boolean }> {
  await sleep(300);
  const idx = DB.users.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false };
  DB.users.splice(idx, 1);
  return { success: true };
}

/* GET: ID로 유저 조회 — 단건 select, 복사본 반환 */
export async function getUserById(id: string): Promise<User | null> {
  await sleep(300);
  const found = DB.users.find((u) => u.id === id) ?? null;
  return found ? deepClone(found) : null;
}
