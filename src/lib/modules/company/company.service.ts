import type { CompanyProfileDto } from "./company.dto";
import { CompanyRepository } from "./company.repository";
import { mapCompanyProfile } from "./company.mapper";

export class CompanyService {
  constructor(private readonly repo: CompanyRepository = new CompanyRepository()) {}

  async getProfile(): Promise<CompanyProfileDto | null> {
    const row = await this.repo.findDefault();
    if (!row) return null;
    return mapCompanyProfile(row);
  }
}