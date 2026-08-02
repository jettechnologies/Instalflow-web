import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";
import {
  getCustomerInstallments,
  getInstallmentById,
} from "../queries/installments";
import type { OverviewSearchType } from "@utils/schema";

export const getCustomerInstallmentsOptions = (params: OverviewSearchType) =>
  queryOptions({
    queryKey: QUERY_KEYS.installments.customer(params),
    queryFn: async () => {
      const response = await getCustomerInstallments(params);
      return response.data;
    },
  });

export const getInstallmentDetailQueryOptions = (installmentId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.installments.detail(installmentId),
    queryFn: async () => {
      const response = await getInstallmentById(installmentId);
      return response.data;
    },
    enabled: Boolean(installmentId),
  });
