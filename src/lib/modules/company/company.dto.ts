import type { LocalizedText } from "../products/product.dto";

export interface CompanyCertificateDto {
  name: string;
  issuer?: string;
  reference?: string;
}

export interface CompanyContactDto {
  phones: string[];
  emails: string[];
  address?: LocalizedText;
  social: Record<string, string>;
}

export interface CompanyProfileDto {
  name: LocalizedText;
  mission: LocalizedText | null;
  vision: LocalizedText | null;
  history: LocalizedText | null;
  certificates: CompanyCertificateDto[];
  contact: CompanyContactDto;
}