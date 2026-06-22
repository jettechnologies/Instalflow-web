import { MarketerOverview } from "@containers/company";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewSearch } from "@utils/schema";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/marketers/"
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
  return <MarketerOverview search={search} />;
}
