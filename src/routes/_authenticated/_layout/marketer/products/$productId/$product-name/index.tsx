import { createFileRoute } from "@tanstack/react-router";
import { MarketerProductDetails } from "@containers/marketer/product-details";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/products/$productId/$product-name/"
)({
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient?.ensureQueryData(
      getProductDetailsQueryOptions(params.productId)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return <MarketerProductDetails productId={productId} />;
}
