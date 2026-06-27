import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { AdminPage } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { productRepository } from "@/lib/products/index";

export const Route = createFileRoute("/admin/products/$id/preview")({
  component: PreviewPage,
});

function PreviewPage() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => productRepository.getById(id),
  });

  if (q.isLoading)
    return (
      <AdminPage title="Preview" width="narrow">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </AdminPage>
    );
  if (!q.data)
    return (
      <AdminPage title="Preview" width="narrow">
        <div className="text-sm">Not found.</div>
      </AdminPage>
    );

  const p = q.data;
  return (
    <AdminPage
      title="Preview"
      width="narrow"
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/products/$id" params={{ id: p.cmsId! }}>
            Edit
          </Link>
        </Button>
      }
    >
      <Section title="Identity">
        <Row label="Name" value={p.name} />
        <Row label="Slug" value={p.slug} mono />
        <Row label="Code" value={p.code} mono />
        <Row label="Series (en)" value={p.series?.en} />
        <Row label="Status" value={p.status ?? "published"} />
      </Section>
      {p.description?.en && (
        <Section title="Description">
          <p className="whitespace-pre-wrap text-sm">{p.description.en}</p>
        </Section>
      )}
      <RenderIf when={!!p.specifications?.length} title="Specifications">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.specifications, null, 2)}
        </pre>
      </RenderIf>
      <RenderIf when={!!p.media?.images?.length || !!p.media?.videos?.length} title="Media">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.media, null, 2)}
        </pre>
      </RenderIf>
      <RenderIf when={!!p.documents?.length} title="Documents">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.documents, null, 2)}
        </pre>
      </RenderIf>
      <RenderIf when={!!p.faq?.length} title="FAQ">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.faq, null, 2)}
        </pre>
      </RenderIf>
      <RenderIf when={!!p.related?.length} title="Related">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.related, null, 2)}
        </pre>
      </RenderIf>
      <RenderIf when={!!p.seo} title="SEO">
        <pre className="overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(p.seo, null, 2)}
        </pre>
      </RenderIf>
      <p className="text-xs text-muted-foreground">
        Mirrors the public product page's conditional-rendering contract:
        only sections backed by real data are shown.
      </p>
    </AdminPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border bg-background p-4">
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function RenderIf({
  when,
  title,
  children,
}: {
  when: boolean;
  title: string;
  children: React.ReactNode;
}) {
  if (!when) return null;
  return <Section title={title}>{children}</Section>;
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | undefined;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-32 shrink-0 text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : ""}>{value}</span>
    </div>
  );
}
