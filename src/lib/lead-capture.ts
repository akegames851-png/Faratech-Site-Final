// Client-side lead capture helper.
//
// Delegates to TanStack server functions in
// `@/lib/modules/leads/lead.functions`, which persist the lead through
// the Repository/Service pipeline and trigger email notification.
// Schemas remain here so the UI keeps its existing validation contract.
import { z } from "zod";
import {
  submitContactLead,
  submitNewsletterLead,
} from "@/lib/modules/leads/lead.functions";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "validation_name").max(100),
  email: z.string().trim().email("validation_email").max(255),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "validation_message").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("validation_email").max(255),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

function currentLocale(): string | null {
  if (typeof window === "undefined") return null;
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  return seg && /^(fa|en|ar)$/.test(seg) ? seg : null;
}

function currentSource(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.pathname || null;
}

export async function submitContact(data: ContactInput, honeypot?: string): Promise<void> {
  await submitContactLead({
    data: {
      name: data.name,
      email: data.email,
      organization: data.organization?.trim() ? data.organization : null,
      message: data.message,
      locale: currentLocale(),
      source: currentSource(),
      website: honeypot ?? "",
    },
  });
}

export async function submitNewsletter(data: NewsletterInput, honeypot?: string): Promise<void> {
  await submitNewsletterLead({
    data: {
      email: data.email,
      locale: currentLocale(),
      source: currentSource(),
      website: honeypot ?? "",
    },
  });
}

