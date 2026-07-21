import { createFileRoute } from "@tanstack/react-router";
import { CompanyApplications } from "@containers/company/applications";
import { ApplicationsSearch } from "@utils/schema";
import { getAllKycApplicationsQueryOptions } from "@services/tanstack-queries/kyc";
import type { KycStatus } from "@utils/types/response-type";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/applications/"
)({
  validateSearch: (search) =>
    ApplicationsSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    page: search.page || "1",
    limit: search.limit || "10",
    sortOrder: search.sortOrder || "desc",
    status: (search.status || undefined) as KycStatus,
    search: search.search,
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

  return <CompanyApplications searchParams={searchParams} />;
}
