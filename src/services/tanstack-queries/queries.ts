import { queryOptions } from "@tanstack/react-query";
import { apiService } from "@services/api-service";
import { QUERY_KEYS } from "../query-keys";
import type { SystemProductDef } from "@utils/types/response-type";

export const getProductsCatalogOptions = (page: number = 1) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.all(page),
    queryFn: async () => {
      const response = await apiService.get<SystemProductDef[]>("/products", {
        page: String(page),
        limit: "12",
      });
      return response.data;
    },
  });

export const getPendingPayoutsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.commissions.pending(),
    queryFn: async () => {
      const response = await apiService.get<any[]>("/commissions/pending");
      return response.data;
    },
  });

export const getLedgerAnalyticsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.ledger.analytics(),
    queryFn: async () => {
      const response = await apiService.get<any>(
        "/analytics/dashboard-summary"
      );
      return response.data;
    },
  });
