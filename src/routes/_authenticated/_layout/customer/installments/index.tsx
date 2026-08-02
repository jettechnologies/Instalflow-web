import { createFileRoute } from "@tanstack/react-router";
import { InstallmentsPage } from "@containers/customer/installments";
import { getCustomerInstallmentsOptions } from "@services/tanstack-queries";
import { OverviewSearch } from "@utils/schema";

export const Route = createFileRoute(
  "/_authenticated/_layout/customer/installments/"
)({
  validateSearch: (search) =>
    OverviewSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    sortOrder: search.sortOrder || "asc",
  }),
  loader: async ({
    context: { queryClient },
    deps: { limit, page, sortOrder },
  }) => {
    await queryClient?.ensureQueryData(
      getCustomerInstallmentsOptions({ limit, page, sortOrder })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const deps = Route.useLoaderDeps();
  return <InstallmentsPage search={deps} />;
}
