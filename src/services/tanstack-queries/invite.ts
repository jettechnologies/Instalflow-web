import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import { getInviteProduct } from "@services/mutations/invite";

export const useInviteProduct = (slug?: string | null) => {
  return useQuery({
    queryKey: slug
      ? QUERY_KEYS.products.bySlug(slug)
      : ["invite", "product", "none"],
    queryFn: () => getInviteProduct(slug as string),
    enabled: Boolean(slug),
  });
};
