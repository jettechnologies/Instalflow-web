import { createFileRoute } from "@tanstack/react-router";
import {
  getCategoriesQueryOptions,
  getProductDetailsQueryOptions,
  getProductGalleryQueryOptions,
} from "@services/tanstack-queries/catalog";
import { ProductDetailsContainer } from "@containers/products/details";

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/products/$productId/$product-name/"
)({
  loader: async ({ params: { productId }, context: { queryClient } }) => {
    await Promise.all([
      queryClient?.ensureQueryData(getProductDetailsQueryOptions(productId)),
      queryClient?.ensureQueryData(getProductGalleryQueryOptions(productId)),
      queryClient?.ensureQueryData(getCategoriesQueryOptions()),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return <ProductDetailsContainer productId={productId} />;
}
