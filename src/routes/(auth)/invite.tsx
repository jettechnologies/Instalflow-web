import { InviteOverview } from "@containers/marketer/invite-overview";
import { getProductBySlugQueryOptions } from "@services/tanstack-queries/catalog";
import { createFileRoute } from "@tanstack/react-router";
import { InviteSearchSchema } from "@utils/schema/invite";

export const Route = createFileRoute("/(auth)/invite")({
  validateSearch: (search) =>
    InviteSearchSchema.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => ({
    product: search.product,
    ref: search.ref,
    variant: search.variant,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const productSlug = deps.product;
    if (productSlug) {
      await queryClient?.ensureQueryData({
        ...getProductBySlugQueryOptions(productSlug),
      });
    }
  },
  head: () => ({
    meta: [{ title: "Apply for installment financing — Instalflow" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  return <InviteOverview search={searchParams} />;
}
