import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import { QUERY_KEYS } from "@services/query-keys";
import { getSignedDocumentUrl } from "../queries/kyc";
import { approveKycApplication, rejectKycApplication } from "../mutations/kyc";

export const useApproveApplication = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (applicationId: string) =>
      approveKycApplication(applicationId),
    meta: {
      invalidatesQuery: QUERY_KEYS.kyc.base(),
      successMessage: "Application approved successfully",
    },
    onSuccess: (data) => {
      if (data.status === "APPROVED") {
        openToast(
          data.message ||
            "KYC application fully approved by both Marketer and Admin.",
          "success"
        );
      } else {
        openToast(
          data.message ||
            "Approval recorded. Awaiting remaining Maker/Checker signature.",
          "success"
        );
      }
    },
  });
};

export const useRejectApplication = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: ({ applicationId, reason }: { applicationId: string; reason: string }) =>
      rejectKycApplication(applicationId, reason),
    meta: {
      invalidatesQuery: QUERY_KEYS.kyc.base(),
      successMessage: "KYC application rejected successfully",
    },
    onSuccess: (data) => {
      openToast(
        data.message || "KYC Application rejected successfully.",
        "warning"
      );
    },
  });
};

export const useGetSignedDocumentUrl = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (applicationId: string) => getSignedDocumentUrl(applicationId),
    onSuccess: (data) => {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      openToast(`Signed URL opened (${data.expiresIn})`, "info");
    },
    onError: (e: Error) => openToast(e.message, "error"),
  });
};
