import { createFileRoute } from "@tanstack/react-router";
import { MarketerProductCatalog } from "@containers/marketer/product-catalog";
import { getMarketerProductsQueryOptions } from "@services/tanstack-queries/marketer";
import { MarketersProductSearch } from "@utils/schema";

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/products/"
)({
  validateSearch: (search) =>
    MarketersProductSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    sortOrder: search.sortOrder || "desc",
    category: search.category || "",
    search: search.search || "",
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    await queryClient?.ensureQueryData(getMarketerProductsQueryOptions(deps));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();

  return <MarketerProductCatalog searchParams={searchParams} />;
}
