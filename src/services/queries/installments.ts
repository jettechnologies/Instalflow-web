import { apiService } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type { OverviewSearchType } from "@utils/schema";
import type {
  CustomerInstallment,
  PaginatedCustomerInstallments,
} from "@utils/types/customer";

export const getCustomerInstallments = ({
  sortOrder = "asc",
  ...params
}: OverviewSearchType) =>
  apiService.get<PaginatedCustomerInstallments>(
    ENDPOINTS.installments.customer,
    { ...params, sortOrder }
  );

export const getInstallmentById = (installmentId: string) =>
  apiService.get<CustomerInstallment>(
    ENDPOINTS.installments.view(installmentId)
  );
