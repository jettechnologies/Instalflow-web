import { MarketerDetail } from "@containers/company";
import { getMarketerDetailQueryOptions } from "@services/tanstack-queries/staff-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/marketers/$marketerId"
)({
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient?.ensureQueryData({
      ...getMarketerDetailQueryOptions(params.marketerId),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { marketerId } = Route.useParams();

  return <MarketerDetail marketerId={marketerId} />;
}
