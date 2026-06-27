/**
 * Release 1.10.1 — Security Hardening Gate (FEATURE-0013 / RFC-0012).
 *
 * Strict environment validation for security-critical configuration.
 *
 * Rules (per RFC-0012):
 *   - No insecure defaults. No fallback credentials. Ever.
 *   - Fail fast on misconfiguration — before any auth code runs.
 *   - SESSION_SECRET MUST be at least 32 characters.
 *   - In production, missing env => hard error, boot stops.
 *   - In development, an explicit opt-in (`ALLOW_DEV_AUTH_DEFAULTS=1`)
 *     is required to use ephemeral dev credentials. Dev defaults are
 *     clearly flagged and MUST NOT be used in production.
 *
 * This module is the single source of truth for the auth boundary.
 * `admin-session.ts` and `auth.functions.ts` both read through it.
 */

export type SecurityEnv = {
  adminUsername: string;
  adminPassword: string;
  sessionSecret: string;
  /** True when ephemeral dev defaults are in effect. Never true in production. */
  devMode: boolean;
};

const MIN_SECRET_LENGTH = 32;

const REQUIRED_VARS = ["ADMIN_USERNAME", "ADMIN_PASSWORD", "SESSION_SECRET"] as const;

class SecurityMisconfigurationError extends Error {
  constructor(message: string) {
    super(
      `[security-hardening] ${message}\n\n` +
        `Required environment variables: ${REQUIRED_VARS.join(", ")}.\n` +
        `SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.\n` +
        `See docs/features/# FEATURE-0013-security-hardening-gate.md and .env.example.`,
    );
    this.name = "SecurityMisconfigurationError";
  }
}

let cached: SecurityEnv | null = null;

/**
 * Validate the security-critical environment.
 *
 * Throws `SecurityMisconfigurationError` on missing or invalid values.
 * Result is cached per-process after the first successful validation.
 */
export function validateEnv(): SecurityEnv {
  if (cached) return cached;

  const isProd = process.env.NODE_ENV === "production";
  const allowDevDefaults =
    !isProd && process.env.ALLOW_DEV_AUTH_DEFAULTS === "1";

  const rawUser = process.env.ADMIN_USERNAME?.trim();
  const rawPass = process.env.ADMIN_PASSWORD?.trim();
  const rawSecret = process.env.SESSION_SECRET ?? "";

  const missing: string[] = [];
  if (!rawUser) missing.push("ADMIN_USERNAME");
  if (!rawPass) missing.push("ADMIN_PASSWORD");
  if (!rawSecret) missing.push("SESSION_SECRET");

  if (missing.length > 0) {
    if (!allowDevDefaults) {
      throw new SecurityMisconfigurationError(
        `Missing required environment variable(s): ${missing.join(", ")}. ` +
          (isProd
            ? "Production boot refuses to continue without explicit credentials."
            : "Set them in your local environment, or opt in to ephemeral dev defaults with ALLOW_DEV_AUTH_DEFAULTS=1 (development only)."),
      );
    }

    // Dev-only path: clearly flagged, ephemeral, NEVER used in production.
    const devSecret = `dev-ephemeral-${cryptoRandom(48)}`;
    // eslint-disable-next-line no-console
    console.warn(
      "[security-hardening] DEV MODE: using ephemeral admin credentials. " +
        "Never use this configuration in production.",
    );
    cached = {
      adminUsername: rawUser || "dev-admin",
      adminPassword: rawPass || `dev-${cryptoRandom(16)}`,
      sessionSecret: rawSecret && rawSecret.length >= MIN_SECRET_LENGTH ? rawSecret : devSecret,
      devMode: true,
    };
    return cached;
  }

  if (rawSecret.length < MIN_SECRET_LENGTH) {
    throw new SecurityMisconfigurationError(
      `SESSION_SECRET is too short (${rawSecret.length} chars); minimum ${MIN_SECRET_LENGTH}.`,
    );
  }

  cached = {
    adminUsername: rawUser!,
    adminPassword: rawPass!,
    sessionSecret: rawSecret,
    devMode: false,
  };
  return cached;
}

/** Test-only: clear cached env. Not exported through any public surface. */
export function __resetSecurityEnvCacheForTests() {
  cached = null;
}

function cryptoRandom(bytes: number): string {
  // Worker / Node both expose globalThis.crypto.
  const buf = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

export { SecurityMisconfigurationError, MIN_SECRET_LENGTH, REQUIRED_VARS };
