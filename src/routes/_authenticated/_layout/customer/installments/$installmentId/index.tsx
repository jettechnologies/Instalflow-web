import { createFileRoute } from "@tanstack/react-router";
import { InstallmentDetail } from "@containers/customer/installment-details";
import { getInstallmentDetailQueryOptions } from "@services/tanstack-queries";

export const Route = createFileRoute(
  "/_authenticated/_layout/customer/installments/$installmentId/"
)({
  loader: async ({ context: { queryClient }, params: { installmentId } }) => {
    await queryClient?.ensureQueryData(
      getInstallmentDetailQueryOptions(installmentId)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { installmentId } = Route.useParams();
  return <InstallmentDetail installmentId={installmentId} />;
}
