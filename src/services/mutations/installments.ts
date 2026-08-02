import { apiService } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type { InstallmentPaymentResult } from "@utils/types/customer";

export const initializeInstallmentPayment = async (
  installmentId: string
): Promise<{ data: InstallmentPaymentResult }> => {
  const response = await apiService.post<InstallmentPaymentResult>(
    ENDPOINTS.installments.pay(installmentId)
  );
  return response;
};
