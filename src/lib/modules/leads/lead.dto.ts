/**
 * Lead module DTOs — wire-shape for contact and newsletter submissions.
 * These contracts are stable and consumed by server functions + UI helpers.
 */
export type LeadKind = "contact" | "newsletter";
export type LeadStatus = "new" | "notified" | "archived";

export interface ContactLeadInput {
  name: string;
  email: string;
  organization?: string | null;
  message: string;
  locale?: string | null;
  source?: string | null;
}

export interface NewsletterLeadInput {
  email: string;
  locale?: string | null;
  source?: string | null;
}

export interface LeadDto {
  id: string;
  kind: LeadKind;
  email: string;
  name: string | null;
  organization: string | null;
  message: string | null;
  locale: string | null;
  source: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadSubmissionResult {
  id: string;
  kind: LeadKind;
  notified: boolean;
}
