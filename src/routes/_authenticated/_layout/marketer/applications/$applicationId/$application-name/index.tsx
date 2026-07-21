import { createFileRoute } from "@tanstack/react-router";
import { MarketerApplicationDetails } from "@containers/marketer/application-details";
import { getKycApplicationByIdQueryOptions } from "@services/tanstack-queries/kyc";

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/applications/$applicationId/$application-name/"
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

  return <MarketerApplicationDetails applicationId={applicationId} />;
}
