/**
 * Lead repository — writes to the `leads` table.
 *
 * Uses the publishable-key server client; the RLS policy
 * `Public can submit leads` authorizes anon INSERTs while keeping
 * SELECT/UPDATE/DELETE locked to service_role.
 *
 * The id is generated client-side so we never request RETURNING (which
 * would require SELECT permission anon does not have).
 */
import { randomUUID } from "node:crypto";
import { getServerSupabase, type DbClient } from "../shared/supabase-server";
import type { LeadKind } from "./lead.dto";

export interface InsertLeadRow {
  kind: LeadKind;
  email: string;
  name?: string | null;
  organization?: string | null;
  message?: string | null;
  locale?: string | null;
  source?: string | null;
}

export class LeadRepository {
  constructor(private readonly db: DbClient = getServerSupabase()) {}

  async insert(row: InsertLeadRow): Promise<{ id: string; created_at: string }> {
    const id = randomUUID();
    const created_at = new Date().toISOString();
    const { error } = await this.db.from("leads").insert({
      id,
      kind: row.kind,
      email: row.email,
      name: row.name ?? null,
      organization: row.organization ?? null,
      message: row.message ?? null,
      locale: row.locale ?? null,
      source: row.source ?? null,
    });
    if (error) throw error;
    return { id, created_at };
  }
}
