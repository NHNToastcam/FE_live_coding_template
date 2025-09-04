/* eslint-disable @typescript-eslint/no-explicit-any */
// jest.setup.ts
import "@testing-library/jest-dom";
import "whatwg-fetch";

// TextEncoder / TextDecoder 폴리필
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

// Modal 포털 루트 (id: modal-root) 미리 붙여두기
const ensurePortalRoot = () => {
  const id = "modal-root";
  if (!document.getElementById(id)) {
    const el = document.createElement("div");
    el.setAttribute("id", id);
    document.body.appendChild(el);
  }
};
ensurePortalRoot();
