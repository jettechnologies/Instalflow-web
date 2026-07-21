import { createFileRoute } from "@tanstack/react-router";
import { CompanyApplicationDetails } from "@containers/company/application-details";
import { getKycApplicationByIdQueryOptions } from "@services/tanstack-queries/kyc";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/applications/$applicationId/$application-name/"
)({
  loader: async ({ context: { queryClient }, params: { applicationId } }) => {
    await queryClient?.ensureQueryData(
      getKycApplicationByIdQueryOptions(applicationId)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { applicationId } = Route.useParams();

  return <CompanyApplicationDetails applicationId={applicationId} />;
}
