// src/api/user.api.ts
import mockUsersData from "@/data/mockUser.json";
import type { User } from "@/types/user";

const users: User[] = [...mockUsersData];

/* GET: 전체 유저 조회 */
export async function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 300); // simulate latency
  });
}

/* POST: 유저 추가 */
export async function addUser(
  user: Omit<User, "id" | "createdAt">
): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        ...user,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      resolve(newUser);
    }, 300);
  });
}

/* GET: 이름으로 검색 */
export async function searchUsersByName(keyword: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = users.filter(
        (user) =>
          user.name.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase())
      );
      resolve(result);
    }, 300);
  });
}

/* DELETE: 유저 삭제 */
export async function deleteUser(id: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    }, 300);
  });
}

/* GET: ID로 유저 조회 */
export async function getUserById(id: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.id === id) ?? null;
      resolve(user);
    }, 300);
  });
}
