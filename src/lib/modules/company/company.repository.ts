/**
 * Company repository — reads the single-row company_profile table.
 */
import { getServerSupabase, type DbClient } from "../shared/supabase-server";

export class CompanyRepository {
  constructor(private readonly db: DbClient = getServerSupabase()) {}

  async findDefault(): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.db
      .from("company_profile")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown> | null) ?? null;
  }
}