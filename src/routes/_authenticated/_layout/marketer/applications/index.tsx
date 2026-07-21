import { createFileRoute } from "@tanstack/react-router";
import { MarketerApplications } from "@containers/marketer/applications";
import { ApplicationsSearch } from "@utils/schema";
import type { KycStatus } from "@utils/types/response-type";
import { getAllKycApplicationsQueryOptions } from "@services/tanstack-queries/kyc";

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/applications/"
)({
  validateSearch: (search) =>
    ApplicationsSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    search: search.search,
    sortOrder: search.sortOrder || "desc",
    status: (search.status || undefined) as KycStatus,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    await queryClient?.ensureQueryData({
      ...getAllKycApplicationsQueryOptions(deps),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();

  return <MarketerApplications searchParams={searchParams} />;
}
