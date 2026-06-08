import { queryOptions } from "@tanstack/react-query";
import { apiService } from "@services/api-service";
import { QUERY_KEYS } from "../query-keys";
import type { SystemProductDef } from "@services/queries/catalog";

// Plans query
// export const getSubscriptionPlansOptions = () =>
//   queryOptions({
//     queryKey: QUERY_KEYS.plans.all(),
//     queryFn: async () => {
//       const response = await apiService.get<any[]>("/subscriptions/plans");
//       return response.data;
//     },
//   });

// Products catalog query
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

// Customer installments timeline query
export const getCustomerInstallmentsOptions = (page: number = 1) =>
  queryOptions({
    queryKey: QUERY_KEYS.installments.customer(page),
    queryFn: async () => {
      const response = await apiService.get<any[]>("/installments/customer", {
        page: String(page),
        limit: "20",
      });
      return response.data;
    },
  });

// Pending payouts clearing queue query
export const getPendingPayoutsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.commissions.pending(),
    queryFn: async () => {
      const response = await apiService.get<any[]>("/commissions/pending");
      return response.data;
    },
  });

// Ledger core aggregations dashboard summary query
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
