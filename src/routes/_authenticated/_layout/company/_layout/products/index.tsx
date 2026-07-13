import { createFileRoute } from "@tanstack/react-router";
import { ProductsSearch } from "@utils/schema";
import {
  getAllProductsQueryOptions,
  getCategoriesQueryOptions,
} from "@services/tanstack-queries/catalog";
import { ProductListContainer } from "@containers/products/list";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/products/"
)({
  validateSearch: (search) =>
    ProductsSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    sortOrder: search.sortOrder || "desc",
    category: search.category || "",
    status: search.status,
    search: search.search || "",
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.all([
      queryClient?.ensureQueryData(getAllProductsQueryOptions(deps)),
      queryClient?.ensureQueryData(getCategoriesQueryOptions()),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();
  return <ProductListContainer searchParams={searchParams} />;
}
