/**
 * Lead email notifier — simple, dependency-free notification path.
 *
 * Sends a notification to the configured inbox via Resend when
 * RESEND_API_KEY and LEAD_NOTIFY_EMAIL are both set; otherwise logs
 * the lead server-side so the pipeline stays exercisable in dev.
 *
 * Kept intentionally small: no template engine, no provider abstraction.
 * Failures are swallowed (returns `false`) so a transient provider
 * outage never blocks lead persistence.
 */
import type { LeadDto } from "./lead.dto";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function notifyNewLead(lead: LeadDto): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_NOTIFY_FROM ?? "Faratech Leads <onboarding@resend.dev>";

  if (!apiKey || !to) {
    // eslint-disable-next-line no-console
    console.info("[leads] notification skipped (no RESEND_API_KEY / LEAD_NOTIFY_EMAIL)", {
      id: lead.id,
      kind: lead.kind,
      email: lead.email,
    });
    return false;
  }

  const subject =
    lead.kind === "contact"
      ? `New contact lead — ${lead.name ?? lead.email}`
      : `New newsletter subscriber — ${lead.email}`;

  const lines = [
    `Kind: ${lead.kind}`,
    `Email: ${lead.email}`,
    lead.name ? `Name: ${lead.name}` : null,
    lead.organization ? `Organization: ${lead.organization}` : null,
    lead.locale ? `Locale: ${lead.locale}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    lead.message ? `\nMessage:\n${lead.message}` : null,
    `\nLead ID: ${lead.id}`,
    `Created at: ${lead.createdAt}`,
  ].filter(Boolean);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn("[leads] notification provider returned", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[leads] notification failed", err);
    return false;
  }
}
