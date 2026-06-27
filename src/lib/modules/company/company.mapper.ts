import type {
  CompanyCertificateDto,
  CompanyContactDto,
  CompanyProfileDto,
} from "./company.dto";
import type { LocalizedText } from "../products/product.dto";

type Row = Record<string, unknown>;

function asLocalized(v: unknown): LocalizedText | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.fa !== "string") return null;
  return {
    fa: o.fa,
    en: typeof o.en === "string" ? o.en : undefined,
    ar: typeof o.ar === "string" ? o.ar : undefined,
  };
}

function asCertificates(v: unknown): CompanyCertificateDto[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((entry): CompanyCertificateDto | null => {
      if (!entry || typeof entry !== "object") return null;
      const o = entry as Record<string, unknown>;
      if (typeof o.name !== "string") return null;
      return {
        name: o.name,
        issuer: typeof o.issuer === "string" ? o.issuer : undefined,
        reference: typeof o.reference === "string" ? o.reference : undefined,
      };
    })
    .filter((x): x is CompanyCertificateDto => x !== null);
}

function asContact(v: unknown): CompanyContactDto {
  const empty: CompanyContactDto = { phones: [], emails: [], social: {} };
  if (!v || typeof v !== "object") return empty;
  const o = v as Record<string, unknown>;
  return {
    phones: Array.isArray(o.phones) ? (o.phones as string[]) : [],
    emails: Array.isArray(o.emails) ? (o.emails as string[]) : [],
    address: asLocalized(o.address) ?? undefined,
    social:
      o.social && typeof o.social === "object"
        ? (o.social as Record<string, string>)
        : {},
  };
}

export function mapCompanyProfile(row: Row): CompanyProfileDto {
  return {
    name: asLocalized(row.name) ?? { fa: "" },
    mission: asLocalized(row.mission),
    vision: asLocalized(row.vision),
    history: asLocalized(row.history),
    certificates: asCertificates(row.certificates),
    contact: asContact(row.contact),
  };
}