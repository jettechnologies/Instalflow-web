import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import { getAllProducts } from "../queries/catalog";
import type { Product } from "@utils/types/response-type";

export const getMarketerProductsQueryOptions = (params: any) =>
  queryOptions({
    queryKey: QUERY_KEYS.marketer.products(),
    queryFn: async () => {
      const response = await getAllProducts({ status: "PUBLISHED", ...params });
      return (response.data.products ?? []) as Product[];
    },
  });
