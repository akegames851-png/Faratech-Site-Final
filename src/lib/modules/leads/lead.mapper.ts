import type { LeadDto, LeadKind, LeadStatus } from "./lead.dto";

type Row = Record<string, unknown>;

export function mapLead(row: Row): LeadDto {
  return {
    id: String(row.id),
    kind: row.kind as LeadKind,
    email: String(row.email),
    name: (row.name as string | null) ?? null,
    organization: (row.organization as string | null) ?? null,
    message: (row.message as string | null) ?? null,
    locale: (row.locale as string | null) ?? null,
    source: (row.source as string | null) ?? null,
    status: row.status as LeadStatus,
    createdAt: String(row.created_at),
  };
}
