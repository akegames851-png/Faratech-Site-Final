import type {
  ContactLeadInput,
  LeadSubmissionResult,
  NewsletterLeadInput,
} from "./lead.dto";
import { LeadRepository } from "./lead.repository";
import { mapLead } from "./lead.mapper";
import { notifyNewLead } from "./lead-email";

export class LeadService {
  constructor(private readonly repo: LeadRepository = new LeadRepository()) {}

  async submitContact(input: ContactLeadInput): Promise<LeadSubmissionResult> {
    const inserted = await this.repo.insert({
      kind: "contact",
      email: input.email.trim(),
      name: input.name.trim(),
      organization: input.organization?.trim() || null,
      message: input.message.trim(),
      locale: input.locale ?? null,
      source: input.source ?? "contact-form",
    });
    const lead = mapLead({
      ...inserted,
      kind: "contact",
      email: input.email,
      name: input.name,
      organization: input.organization ?? null,
      message: input.message,
      locale: input.locale ?? null,
      source: input.source ?? "contact-form",
      status: "new",
    });
    const notified = await notifyNewLead(lead);
    return { id: lead.id, kind: "contact", notified };
  }

  async submitNewsletter(input: NewsletterLeadInput): Promise<LeadSubmissionResult> {
    const inserted = await this.repo.insert({
      kind: "newsletter",
      email: input.email.trim(),
      locale: input.locale ?? null,
      source: input.source ?? "newsletter",
    });
    const lead = mapLead({
      ...inserted,
      kind: "newsletter",
      email: input.email,
      name: null,
      organization: null,
      message: null,
      locale: input.locale ?? null,
      source: input.source ?? "newsletter",
      status: "new",
    });
    const notified = await notifyNewLead(lead);
    return { id: lead.id, kind: "newsletter", notified };
  }
}
