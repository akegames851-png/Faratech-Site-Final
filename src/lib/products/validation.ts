import type { Product, ValidationIssue, ValidationResult } from "./types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const DOC_KINDS = new Set([
  "brochure",
  "manual",
  "datasheet",
  "certificate",
  "warranty",
  "other",
]);

const issue = (
  path: (string | number)[],
  code: string,
  message: string,
): ValidationIssue => ({
  path: path.map(String),
  code,
  message,
});

export const validateIdentity = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  if (!p.slug || !p.slug.trim()) {
    out.push(issue(["slug"], "required", "Slug is required"));
  } else if (!SLUG_RE.test(p.slug)) {
    out.push(
      issue(
        ["slug"],
        "format",
        "Slug must be kebab-case (lowercase a-z, 0-9, hyphens)",
      ),
    );
  }
  if (!p.name || !p.name.trim()) {
    out.push(issue(["name"], "required", "Name is required"));
  }
  if (p.createdAt && !ISO_RE.test(p.createdAt)) {
    out.push(issue(["createdAt"], "format", "createdAt must be ISO 8601"));
  }
  if (p.updatedAt && !ISO_RE.test(p.updatedAt)) {
    out.push(issue(["updatedAt"], "format", "updatedAt must be ISO 8601"));
  }
  return out;
};

export const validateDescription = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  const max = 4000;
  if (p.description?.en && p.description.en.length > max) {
    out.push(
      issue(["description", "en"], "max", `Max ${max} characters`),
    );
  }
  if (p.shortDescription?.en && p.shortDescription.en.length > 280) {
    out.push(
      issue(
        ["shortDescription", "en"],
        "max",
        "Short description should be ≤ 280 characters",
      ),
    );
  }
  return out;
};

export const validateSpecifications = (
  p: Partial<Product>,
): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  if (!p.specifications) return out;
  const groupKeys = new Set<string>();
  p.specifications.forEach((g, gi) => {
    if (!g.key) out.push(issue(["specifications", gi, "key"], "required", "Group key is required"));
    else if (groupKeys.has(g.key))
      out.push(
        issue(["specifications", gi, "key"], "unique", `Duplicate group key: ${g.key}`),
      );
    else groupKeys.add(g.key);
    if (!g.label?.en)
      out.push(issue(["specifications", gi, "label", "en"], "required", "Group label is required"));
    const itemKeys = new Set<string>();
    g.items?.forEach((it, ii) => {
      if (!it.key)
        out.push(issue(["specifications", gi, "items", ii, "key"], "required", "Item key required"));
      else if (itemKeys.has(it.key))
        out.push(
          issue(
            ["specifications", gi, "items", ii, "key"],
            "unique",
            `Duplicate item key in group ${g.key}: ${it.key}`,
          ),
        );
      else itemKeys.add(it.key);
      if (!it.label?.en)
        out.push(
          issue(["specifications", gi, "items", ii, "label", "en"], "required", "Item label required"),
        );
      if (!it.value?.en)
        out.push(
          issue(["specifications", gi, "items", ii, "value", "en"], "required", "Item value required"),
        );
    });
  });
  return out;
};

export const validateDocuments = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  p.documents?.forEach((d, i) => {
    if (!DOC_KINDS.has(d.kind))
      out.push(issue(["documents", i, "kind"], "enum", `Invalid document kind: ${d.kind}`));
    if (!d.src) out.push(issue(["documents", i, "src"], "required", "Document src is required"));
    if (d.sizeBytes != null && d.sizeBytes < 0)
      out.push(issue(["documents", i, "sizeBytes"], "min", "sizeBytes must be ≥ 0"));
  });
  return out;
};

export const validateSEO = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  if (!p.seo) return out;
  if (p.seo.title?.en && p.seo.title.en.length > 70)
    out.push(issue(["seo", "title", "en"], "max", "SEO title should be ≤ 70 characters"));
  if (p.seo.description?.en && p.seo.description.en.length > 160)
    out.push(
      issue(["seo", "description", "en"], "max", "SEO description should be ≤ 160 characters"),
    );
  if (p.seo.canonical && !/^https?:\/\//.test(p.seo.canonical))
    out.push(issue(["seo", "canonical"], "format", "Canonical must be an absolute URL"));
  return out;
};

export const validateFAQ = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  p.faq?.forEach((f, i) => {
    if (!f.question?.en)
      out.push(issue(["faq", i, "question", "en"], "required", "Question (en) is required"));
    if (!f.answer?.en)
      out.push(issue(["faq", i, "answer", "en"], "required", "Answer (en) is required"));
  });
  return out;
};

export const validateRelated = (p: Partial<Product>): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  const seen = new Set<string>();
  p.related?.forEach((r, i) => {
    if (!r.category)
      out.push(issue(["related", i, "category"], "required", "Category is required"));
    if (!r.slug)
      out.push(issue(["related", i, "slug"], "required", "Slug is required"));
    const key = `${r.category}/${r.slug}`;
    if (seen.has(key))
      out.push(issue(["related", i], "unique", `Duplicate related ref: ${key}`));
    seen.add(key);
    if (r.slug && p.slug && r.slug === p.slug)
      out.push(issue(["related", i, "slug"], "self", "Cannot relate a product to itself"));
  });
  return out;
};

export const validateProduct = (p: Partial<Product>): ValidationResult => {
  const issues = [
    ...validateIdentity(p),
    ...validateDescription(p),
    ...validateSpecifications(p),
    ...validateDocuments(p),
    ...validateSEO(p),
    ...validateFAQ(p),
    ...validateRelated(p),
  ];
  return issues.length === 0 ? { ok: true } : { ok: false, issues };
};