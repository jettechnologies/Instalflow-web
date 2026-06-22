import { AdminOverview } from "@containers/company";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewSearch } from "@utils/schema";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/admins/"
)({
  validateSearch: (search) =>
    OverviewSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return <AdminOverview search={search} />;
}
