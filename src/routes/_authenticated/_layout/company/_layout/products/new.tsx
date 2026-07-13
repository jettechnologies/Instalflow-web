import { createFileRoute } from "@tanstack/react-router";
import { getCategoriesQueryOptions } from "@services/tanstack-queries/catalog";
import { NewProductContainer } from "@containers/products/new";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/products/new"
)({
  validateSearch: (search: Record<string, unknown>) => ({
    step: String(search.step || "1"),
    productId: search.productId ? String(search.productId) : undefined,
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient?.ensureQueryData(getCategoriesQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { step, productId } = Route.useSearch();
  return <NewProductContainer step={step} productId={productId} />;
}
