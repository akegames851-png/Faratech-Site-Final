/**
 * Release 1.9 — Authentication & Admin Security Layer (FEATURE-0011 / RFC-0010).
 *
 * Public RPC surface for the admin auth layer. Three operations:
 *
 *   - `loginAdmin`     — verify credentials, mint session cookie.
 *   - `logoutAdmin`    — clear session cookie.
 *   - `getAdminStatus` — server-validated session probe used by guards.
 *
 * All three live OUTSIDE the protected middleware (they must be callable
 * by unauthenticated visitors) but never expose anything beyond a boolean
 * status / username.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { record } from "@/lib/audit/audit-log";
import { validateEnv } from "@/lib/security/validate-env";

import { getAdminSession } from "./admin-session";
import { resolveRole, type Role } from "./roles";

const LoginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

function configuredAdmin(): { username: string; password: string } {
  // Release 1.10.1 — Security Hardening Gate. No fallback credentials.
  // `validateEnv()` throws on missing ADMIN_USERNAME / ADMIN_PASSWORD.
  const { adminUsername, adminPassword } = validateEnv();
  return { username: adminUsername, password: adminPassword };
}

/** Constant-time string compare to avoid leaking length / prefix info. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => LoginSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const expected = configuredAdmin();
    const userOk = safeEqual(data.username, expected.username);
    const passOk = safeEqual(data.password, expected.password);
    if (!userOk || !passOk) {
      record({
        actor: data.username,
        role: null,
        action: "auth.login",
        resource: "session",
        resourceId: null,
        outcome: "failure",
      });
      return { ok: false, error: "Invalid username or password." };
    }
    const session = await getAdminSession();
    const role: Role = resolveRole(expected.username);
    await session.update({
      isAdmin: true,
      username: expected.username,
      loginAt: Date.now(),
      role,
    });
    record({
      actor: expected.username,
      role,
      action: "auth.login",
      resource: "session",
      resourceId: null,
      outcome: "success",
    });
    return { ok: true };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true }> => {
    const session = await getAdminSession();
    const username = session.data.username ?? null;
    const role = session.data.role ?? null;
    await session.clear();
    record({
      actor: username,
      role,
      action: "auth.logout",
      resource: "session",
      resourceId: null,
      outcome: "success",
    });
    return { ok: true };
  },
);

export type AdminStatusDto = {
  isAdmin: boolean;
  username: string | null;
  role: Role | null;
};

export const getAdminStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminStatusDto> => {
    const session = await getAdminSession();
    return {
      isAdmin: Boolean(session.data.isAdmin),
      username: session.data.username ?? null,
      role: session.data.role ?? null,
    };
  },
);
