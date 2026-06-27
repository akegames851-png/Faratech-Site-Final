/**
 * Release 1.9 — Admin login route (FEATURE-0011 / RFC-0010).
 *
 * Public route — the only entry point to the admin layer. Submits
 * credentials to the `loginAdmin` server function, which mints a
 * server-validated, HTTP-only session cookie. On success, redirects
 * to the originally requested URL (or `/admin`).
 */
import { useState } from "react";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminStatus, loginAdmin } from "@/lib/auth/auth.functions";

const SearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

function safeRedirectTarget(value: string | undefined): string {
  // Only allow internal, same-origin paths to prevent open redirects.
  if (!value) return "/admin";
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export const Route = createFileRoute("/login")({
  validateSearch: (s) => SearchSchema.parse(s),
  beforeLoad: async ({ search }) => {
    const status = await getAdminStatus();
    if (status.isAdmin) {
      throw redirect({ to: safeRedirectTarget(search.redirect) });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin sign in — FARATECH" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();
  const login = useServerFn(loginAdmin);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await login({ data: { username, password } });
      if (!res.ok) {
        setError(res.error);
        setPending(false);
        return;
      }
      // Force the router to re-evaluate guards with the new session.
      await router.invalidate();
      navigate({ to: safeRedirectTarget(search.redirect) });
    } catch {
      setError("Sign in failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border bg-background p-6 shadow-sm"
        aria-labelledby="login-title"
      >
        <div className="space-y-1 text-center">
          <h1 id="login-title" className="text-lg font-semibold tracking-tight">
            FARATECH CMS
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access the admin dashboard.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />
        </div>

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
