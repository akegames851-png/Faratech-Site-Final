import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { LeadSubmissionResult } from "./lead.dto";
import { LeadService } from "./lead.service";
import {
  consume,
  LEAD_EMAIL_LIMIT,
  LEAD_GLOBAL_LIMIT,
} from "./lead.rate-limit";

/**
 * Honeypot field — must remain empty for a real human submission.
 * Real browsers using the form leave it blank; naive bots fill every input.
 */
const honeypot = z.string().max(0).optional().nullable();

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  organization: z.string().trim().max(150).optional().nullable(),
  message: z.string().trim().min(10).max(2000),
  locale: z.string().trim().max(8).optional().nullable(),
  source: z.string().trim().max(64).optional().nullable(),
  website: honeypot,
});

const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
  locale: z.string().trim().max(8).optional().nullable(),
  source: z.string().trim().max(64).optional().nullable(),
  website: honeypot,
});

class RateLimitError extends Error {
  constructor(public readonly retryAfterMs: number) {
    super("rate_limited");
    this.name = "RateLimitError";
  }
}

function enforceLeadLimits(email: string): void {
  const g = consume("__global__", LEAD_GLOBAL_LIMIT);
  if (!g.ok) throw new RateLimitError(g.retryAfterMs ?? LEAD_GLOBAL_LIMIT.windowMs);
  const e = consume(`email:${email.toLowerCase()}`, LEAD_EMAIL_LIMIT);
  if (!e.ok) throw new RateLimitError(e.retryAfterMs ?? LEAD_EMAIL_LIMIT.windowMs);
}

export const submitContactLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmissionResult> => {
    // Honeypot tripped — return success-shaped response without persisting,
    // so the bot can't distinguish acceptance from rejection.
    if (data.website && data.website.length > 0) {
      return { id: "00000000-0000-0000-0000-000000000000", kind: "contact", notified: false };
    }
    enforceLeadLimits(data.email);
    const service = new LeadService();
    return service.submitContact(data);
  });

export const submitNewsletterLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => newsletterSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmissionResult> => {
    if (data.website && data.website.length > 0) {
      return { id: "00000000-0000-0000-0000-000000000000", kind: "newsletter", notified: false };
    }
    enforceLeadLimits(data.email);
    const service = new LeadService();
    return service.submitNewsletter(data);
  });

export { RateLimitError };
