import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAdmin } from "@/lib/auth/auth.functions";

import { AdminNav } from "./admin-nav";

/**
 * Release 1.8 — Admin Dashboard Header
 * Release 1.9 — Adds logout control (FEATURE-0011 / RFC-0010).
 *
 * Context-aware top header. Owns the mobile navigation trigger so the
 * sidebar can stay hidden behind a drawer on small viewports.
 *
 * Presentation-only — the only business logic is the logout RPC call,
 * which calls the `logoutAdmin` server function and bounces the user
 * to `/login`.
 */
export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const navigate = useNavigate();
  const logout = useServerFn(logoutAdmin);

  async function onLogout() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      await router.invalidate();
      navigate({ to: "/login" });
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-4 py-4">
            <SheetTitle className="text-sm font-semibold tracking-tight">
              FARATECH CMS
            </SheetTitle>
          </SheetHeader>
          <AdminNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        <span className="font-mono text-xs">{pathname}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        disabled={signingOut}
        aria-label="Sign out"
      >
        <LogOut className="mr-1 h-4 w-4" />
        {signingOut ? "Signing out…" : "Sign out"}
      </Button>
    </header>
  );
}
