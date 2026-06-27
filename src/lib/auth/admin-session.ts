/**
 * Release 1.9 — Authentication & Admin Security Layer
 *
 * Server-only session helpers backing the admin auth layer
 * (FEATURE-0011 / RFC-0010).
 *
 * - Session-based, cookie-stored, server-validated.
 * - HTTP-only, signed/encrypted via TanStack Start's `useSession`.
 * - Used exclusively to gate `/admin/*` routes and CMS server functions.
 *   Public product flows MUST NOT depend on anything in this file.
 */
import { useSession } from "@tanstack/react-start/server";

import { validateEnv } from "@/lib/security/validate-env";

import type { Role } from "./roles";

export type AdminSessionData = {
  isAdmin?: boolean;
  username?: string;
  loginAt?: number;
  /** Release 1.10 — RBAC role for the active admin session. */
  role?: Role;
};

function sessionConfig() {
  // Release 1.10.1 — Security Hardening Gate. No fallback secret. Ever.
  // `validateEnv()` throws if SESSION_SECRET is missing or too short.
  const { sessionSecret } = validateEnv();
  return {
    password: sessionSecret,
    name: "faratech_admin_session",
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSessionData>(sessionConfig());
}

/**
 * Throws a Response(401) when the caller has no valid admin session.
 * Returned from a server function, the framework propagates the 401
 * back to the client; from a `beforeLoad`, prefer
 * `requireAdminOrRedirect`.
 */
export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getAdminSession();
  if (!session.data.isAdmin || !session.data.username) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return { username: session.data.username };
}
