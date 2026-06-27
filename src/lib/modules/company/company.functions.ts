import { createServerFn } from "@tanstack/react-start";
import type { CompanyProfileDto } from "./company.dto";
import { CompanyService } from "./company.service";

export const getCompanyProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<CompanyProfileDto | null> => {
    const service = new CompanyService();
    return service.getProfile();
  },
);