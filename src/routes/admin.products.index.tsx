import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cmsArchiveProduct,
  cmsListProducts,
  cmsPublishProduct,
  cmsUnpublishProduct,
} from "@/lib/modules/products/cms.functions";
import type {
  ProductCategoryKey,
  ProductStatus,
} from "@/lib/products/index";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/admin/products/")({
  component: ProductListPage,
});

function ProductListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategoryKey | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "any">("any");

  const listFn = useServerFn(cmsListProducts);
  const publishFn = useServerFn(cmsPublishProduct);
  const unpublishFn = useServerFn(cmsUnpublishProduct);
  const archiveFn = useServerFn(cmsArchiveProduct);

  const list = useQuery({
    queryKey: ["admin-products", { search, category, status }],
    queryFn: () =>
      listFn({
        data: {
          search: search || undefined,
          category: category === "all" ? undefined : category,
          status,
        },
      }),
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin-products"] });

  const publishM = useMutation({
    mutationFn: (id: string) => publishFn({ data: { cmsId: id } }),
    onSuccess: () => {
      toast.success("Published");
      invalidate();
    },
  });
  const unpublishM = useMutation({
    mutationFn: (id: string) => unpublishFn({ data: { cmsId: id } }),
    onSuccess: () => {
      toast.success("Moved to draft");
      invalidate();
    },
  });
  const archiveM = useMutation({
    mutationFn: (id: string) => archiveFn({ data: { cmsId: id } }),
    onSuccess: () => {
      toast.success("Archived");
      invalidate();
    },
  });

  return (
    <AdminPage
      title="Products"
      description={`${list.data?.total ?? "…"} records · seeded from the static catalog`}
      actions={
        <Button asChild>
          <Link to="/admin/products/new">New product</Link>
        </Button>
      }
    >

      <div className="flex flex-wrap gap-2 rounded-md border bg-background p-3">
        <Input
          placeholder="Search slug, name or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.key} value={c.key}>
                {c.title.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.items.map((p) => {
              const st = p.status ?? "published";
              return (
                <TableRow key={p.cmsId}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                  <TableCell className="text-xs">{p.category}</TableCell>
                  <TableCell>
                    <span
                      className={
                        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide " +
                        (st === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : st === "draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-zinc-200 text-zinc-700")
                      }
                    >
                      {st}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.updatedAt?.slice(0, 10) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="sm" variant="outline">
                        <Link
                          to="/admin/products/$id"
                          params={{ id: p.cmsId! }}
                        >
                          Edit
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          to="/admin/products/$id/preview"
                          params={{ id: p.cmsId! }}
                        >
                          Preview
                        </Link>
                      </Button>
                      {st === "published" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => unpublishM.mutate(p.cmsId!)}
                        >
                          Unpublish
                        </Button>
                      ) : st === "draft" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => publishM.mutate(p.cmsId!)}
                        >
                          Publish
                        </Button>
                      ) : null}
                      {st !== "archived" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveM.mutate(p.cmsId!)}
                        >
                          Archive
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminPage>
  );
}