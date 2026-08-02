import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import { QUERY_KEYS } from "../query-keys";
import { initializeInstallmentPayment } from "@services/mutations/installments";

export const useInitializeInstallmentPayment = () => {
  const { openToast } = useToastContext();

  return useMutation({
    mutationFn: (installmentId: string) =>
      initializeInstallmentPayment(installmentId),
    meta: {
      invalidatesQuery: QUERY_KEYS.installments.customer(),
      errorMessage: "Payment initialization failed.",
    },
    onSuccess: (response) => {
      const data = response.data;

      openToast("Payment gateway context loaded", "success");

      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
  });
};
