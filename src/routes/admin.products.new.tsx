import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";
import { cmsCreateProduct } from "@/lib/modules/products/cms.functions";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const create = useServerFn(cmsCreateProduct);
  return (
    <AdminPage title="New product" width="narrow">
      <ProductForm
        submitLabel="Create draft"
        initial={{
          category: CATEGORIES[0]!.key,
          product: { slug: "", name: "", status: "draft" },
        }}
        onSubmit={async (v) => {
          const created = await create({
            data: { category: v.category, product: v.product },
          });
          toast.success("Product created (mock — not persisted)");
          navigate({
            to: "/admin/products/$id",
            params: { id: created.cmsId! },
          });
        }}
      />
    </AdminPage>
  );
}

