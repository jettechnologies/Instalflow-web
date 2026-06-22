import { AdminDetails } from "@containers/company";
import {
  getAdminDetailQueryOptions,
  getMarketersCreatedByAdminQueryOptions,
} from "@services/tanstack-queries/staff-management";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewSearch } from "@utils/schema";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/admins/$adminId"
)({
  validateSearch: (search) =>
    OverviewSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    sortOrder: search.sortOrder || "desc",
  }),
  loader: async ({
    context: { queryClient },
    params: { adminId },
    deps: { limit, page, sortOrder },
  }) => {
    await Promise.all([
      queryClient?.ensureQueryData({
        ...getAdminDetailQueryOptions(adminId),
      }),
      queryClient?.ensureQueryData({
        ...getMarketersCreatedByAdminQueryOptions({
          adminId,
          params: { limit, page, sortOrder },
        }),
      }),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { adminId } = Route.useParams();
  const params = Route.useLoaderDeps();

  return <AdminDetails adminId={adminId} params={params} />;
}
