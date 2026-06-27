/**
 * Release 1.10 — Append-only audit log (FEATURE-0012 / RFC-0011).
 *
 * Minimal internal storage for admin / CMS events. Append-only by design:
 *   - No `update`, no `delete`, no rotation API.
 *   - Logging is fire-and-forget — `record()` never throws and never blocks
 *     the calling handler.
 *
 * Storage is an in-process ring buffer (the runtime is a stateless Worker,
 * so cross-instance persistence is intentionally out of scope for 1.10;
 * see "Future Extensions" in RFC-0011).
 *
 * This module is consumed by `audit-middleware.ts`. CMS handlers MUST NOT
 * call `record` directly — go through the middleware so the call sits in
 * the architectural chain Auth → Role → Server Fn → Audit Logger.
 */

export type AuditAction =
  | "cms.product.create"
  | "cms.product.update"
  | "cms.product.delete"
  | "cms.product.publish"
  | "cms.product.unpublish"
  | "cms.product.archive"
  | "auth.login"
  | "auth.logout";

export type AuditResource = "product" | "session";

export type AuditEntry = {
  id: string;
  ts: number;
  actor: string | null;
  role: string | null;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string | null;
  outcome: "success" | "failure";
  metadata?: Record<string, string | number | boolean | null>;
};

const MAX_ENTRIES = 1000;
const buffer: AuditEntry[] = [];

function nextId(): string {
  // Sortable, collision-resistant enough for an in-process buffer.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Append a single audit entry. Never throws — failures are swallowed so
 * audit logging cannot block or break the calling server function.
 */
export function record(entry: Omit<AuditEntry, "id" | "ts">): void {
  try {
    buffer.push({ id: nextId(), ts: Date.now(), ...entry });
    if (buffer.length > MAX_ENTRIES) {
      buffer.splice(0, buffer.length - MAX_ENTRIES);
    }
  } catch {
    // Intentionally silent — audit must never break the request path.
  }
}

/** Read-only snapshot, newest first. Intended for admin inspection only. */
export function list(limit = 100): readonly AuditEntry[] {
  const slice = buffer.slice(-Math.max(1, Math.min(limit, MAX_ENTRIES)));
  return slice.slice().reverse();
}

/** Test / diagnostic only — never call from a request handler. */
export function _resetForTests(): void {
  buffer.length = 0;
}
