import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import {
  cmsGetProduct,
  cmsUpdateProduct,
} from "@/lib/modules/products/cms.functions";
import type { ProductCategoryKey } from "@/lib/products/index";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProductPage,
});

function categoryOf(cmsId: string): ProductCategoryKey {
  for (const c of CATEGORIES) {
    if (c.products.some((p) => p.cmsId === cmsId)) return c.key;
  }
  return CATEGORIES[0]!.key;
}

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getProduct = useServerFn(cmsGetProduct);
  const updateProduct = useServerFn(cmsUpdateProduct);

  const q = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getProduct({ data: { cmsId: id } }),
  });

  if (q.isLoading)
    return (
      <AdminPage title="Loading…" width="narrow">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </AdminPage>
    );
  if (!q.data)
    return (
      <AdminPage title="Not found" width="narrow">
        <p className="text-sm">Product not found.</p>
        <Button asChild variant="outline">
          <Link to="/admin/products">Back to list</Link>
        </Button>
      </AdminPage>
    );

  const product = q.data;
  const initialCategory = categoryOf(product.cmsId!);

  return (
    <AdminPage
      title={product.name}
      description={<span className="font-mono text-xs">{product.cmsId}</span>}
      width="narrow"
      actions={
        <>
          <Button asChild variant="outline">
            <Link
              to="/admin/products/$id/preview"
              params={{ id: product.cmsId! }}
            >
              Preview
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/admin/products">Back</Link>
          </Button>
        </>
      }
    >
      <ProductForm
        submitLabel="Save changes"
        initial={{ category: initialCategory, product }}
        onSubmit={async (v) => {
          await updateProduct({
            data: {
              cmsId: product.cmsId!,
              category: v.category,
              product: v.product,
            },
          });
          toast.success("Saved (mock — not persisted)");
          qc.invalidateQueries({ queryKey: ["admin-product", id] });
          qc.invalidateQueries({ queryKey: ["admin-products"] });
          navigate({ to: "/admin/products" });
        }}
      />
    </AdminPage>
  );
}
