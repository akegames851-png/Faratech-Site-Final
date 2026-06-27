import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  validateProduct,
  type Product,
  type ProductCategoryKey,
  type ValidationIssue,
} from "@/lib/products/index";
import { CATEGORIES } from "@/lib/products";

export type ProductFormValue = {
  category: ProductCategoryKey;
  product: Product;
};

const STATUSES: Product["status"][] = ["draft", "published", "archived"];

function findIssue(issues: ValidationIssue[], path: string) {
  return issues.find((i) => i.path.join(".") === path);
}

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: ProductFormValue;
  submitLabel: string;
  onSubmit: (value: ProductFormValue) => Promise<void> | void;
}) {
  const [value, setValue] = useState<ProductFormValue>(initial);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [busy, setBusy] = useState(false);

  const patchProduct = (patch: Partial<Product>) =>
    setValue((v) => ({ ...v, product: { ...v.product, ...patch } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateProduct(value.product);
    if (!result.ok) {
      setIssues(result.issues);
      return;
    }
    setIssues([]);
    setBusy(true);
    try {
      await onSubmit(value);
    } finally {
      setBusy(false);
    }
  };

  const err = (path: string) => findIssue(issues, path)?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="copy">Copy</TabsTrigger>
          <TabsTrigger value="specs">Specs</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-4 pt-4">
          <Field label="Category">
            <Select
              value={value.category}
              onValueChange={(v) =>
                setValue((s) => ({ ...s, category: v as ProductCategoryKey }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.title.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Slug (route identifier)" error={err("slug")}>
            <Input
              value={value.product.slug}
              onChange={(e) => patchProduct({ slug: e.target.value })}
              placeholder="my-product"
            />
          </Field>
          <Field label="Name" error={err("name")}>
            <Input
              value={value.product.name}
              onChange={(e) => patchProduct({ name: e.target.value })}
            />
          </Field>
          <Field label="Code (SKU)">
            <Input
              value={value.product.code ?? ""}
              onChange={(e) =>
                patchProduct({ code: e.target.value || undefined })
              }
            />
          </Field>
          <Field label="Series (en)">
            <Input
              value={value.product.series?.en ?? ""}
              onChange={(e) =>
                patchProduct({
                  series: e.target.value
                    ? { ...(value.product.series ?? { en: "" }), en: e.target.value }
                    : undefined,
                })
              }
            />
          </Field>
          <Field label="Status">
            <Select
              value={value.product.status ?? "draft"}
              onValueChange={(v) => patchProduct({ status: v as Product["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s!}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </TabsContent>

        <TabsContent value="copy" className="space-y-4 pt-4">
          <LocalizedTextarea
            label="Short description"
            value={value.product.shortDescription}
            onChange={(v) => patchProduct({ shortDescription: v })}
            rows={2}
          />
          <LocalizedTextarea
            label="Description"
            value={value.product.description}
            onChange={(v) => patchProduct({ description: v })}
            rows={6}
          />
        </TabsContent>

        <TabsContent value="specs" className="pt-4">
          <JsonField
            label="Specifications (JSON array of groups)"
            value={value.product.specifications}
            onChange={(v) => patchProduct({ specifications: v as Product["specifications"] })}
            placeholder='[{"key":"frame","label":{"en":"Frame"},"items":[]}]'
          />
        </TabsContent>

        <TabsContent value="media" className="pt-4">
          <JsonField
            label="Media (images & videos — refs only, no uploads in Phase 1C)"
            value={value.product.media}
            onChange={(v) => patchProduct({ media: v as Product["media"] })}
            placeholder='{"images":[{"src":"cms://...","isPrimary":true}]}'
          />
        </TabsContent>

        <TabsContent value="docs" className="pt-4">
          <JsonField
            label="Documents (refs only)"
            value={value.product.documents}
            onChange={(v) => patchProduct({ documents: v as Product["documents"] })}
            placeholder='[{"kind":"brochure","src":"cms://..."}]'
          />
        </TabsContent>

        <TabsContent value="faq" className="pt-4">
          <JsonField
            label="FAQ"
            value={value.product.faq}
            onChange={(v) => patchProduct({ faq: v as Product["faq"] })}
            placeholder='[{"question":{"en":"..."},"answer":{"en":"..."}}]'
          />
        </TabsContent>

        <TabsContent value="related" className="pt-4">
          <JsonField
            label="Related products"
            value={value.product.related}
            onChange={(v) => patchProduct({ related: v as Product["related"] })}
            placeholder='[{"category":"power-wheelchairs","slug":"beta25"}]'
          />
        </TabsContent>

        <TabsContent value="seo" className="pt-4">
          <JsonField
            label="SEO overrides"
            value={value.product.seo}
            onChange={(v) => patchProduct({ seo: v as Product["seo"] })}
            placeholder='{"title":{"en":"..."},"description":{"en":"..."}}'
          />
        </TabsContent>
      </Tabs>

      {issues.length > 0 && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <div className="mb-1 font-medium">Validation failed</div>
          <ul className="list-disc space-y-0.5 pl-5">
            {issues.map((i, k) => (
              <li key={k}>
                <code className="text-xs">{i.path.join(".") || "(root)"}</code> — {i.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function LocalizedTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: { en: string; fa?: string; ar?: string } | undefined;
  onChange: (v: { en: string; fa?: string; ar?: string } | undefined) => void;
  rows?: number;
}) {
  const v = value ?? { en: "" };
  const update = (lang: "en" | "fa" | "ar", text: string) => {
    const next = { ...v, [lang]: text };
    if (!next.en && !next.fa && !next.ar) onChange(undefined);
    else onChange(next);
  };
  return (
    <div className="space-y-2 rounded-md border p-3">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div>
        <Label className="text-xs">EN</Label>
        <Textarea rows={rows} value={v.en ?? ""} onChange={(e) => update("en", e.target.value)} />
      </div>
      <div>
        <Label className="text-xs">FA</Label>
        <Textarea
          rows={rows}
          dir="rtl"
          value={v.fa ?? ""}
          onChange={(e) => update("fa", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-xs">AR</Label>
        <Textarea
          rows={rows}
          dir="rtl"
          value={v.ar ?? ""}
          onChange={(e) => update("ar", e.target.value)}
        />
      </div>
    </div>
  );
}

function JsonField<T>({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: T | undefined;
  onChange: (v: T | undefined) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(() =>
    value === undefined ? "" : JSON.stringify(value, null, 2),
  );
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        rows={12}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          if (!next.trim()) {
            setError(null);
            onChange(undefined);
            return;
          }
          try {
            const parsed = JSON.parse(next) as T;
            setError(null);
            onChange(parsed);
          } catch (err) {
            setError((err as Error).message);
          }
        }}
        className="font-mono text-xs"
      />
      {error && <p className="text-xs text-destructive">JSON: {error}</p>}
      <p className="text-xs text-muted-foreground">
        Edit as JSON. Leave empty to clear the field. Structured form editors
        land in Phase 2.
      </p>
    </div>
  );
}