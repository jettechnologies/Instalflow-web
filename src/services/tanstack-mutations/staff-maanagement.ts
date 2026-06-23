import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import {
  inviteMarketer,
  createAdmin,
  handleApprovalRequest,
  requestToggleMarketerStatus,
  requestDeleteMarketerAccount,
  toggleMarketerStatus,
  deleteMarketerAccount,
  toggleAdminStatus,
  deleteAdminAccount,
} from "@services/mutations/staff-management";
import { QUERY_KEYS } from "@services/query-keys";

export const useInviteMarketer = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: inviteMarketer,
    meta: {
      invalidatesQuery: QUERY_KEYS.marketer_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Marketer Invited Successful";
      openToast(message, "success");
    },
  });
};

export const useCreateAdmin = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: createAdmin,
    meta: {
      invalidatesQuery: QUERY_KEYS.admin_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Admin Invited Successful";
      openToast(message, "success");
    },
  });
};

export const useHandleApprovalRequest = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: handleApprovalRequest,
    meta: {
      invalidatesQuery: QUERY_KEYS.admin_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Approval Request Handled Successfully";
      openToast(message, "success");
    },
  });
};

export const useRequestToggleMarketerStatus = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: requestToggleMarketerStatus,
    meta: {
      invalidatesQuery: QUERY_KEYS.marketer_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Marketer Status Toggled Successfully";
      openToast(message, "success");
    },
  });
};

export const useRequestDeleteMarketerAccount = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: requestDeleteMarketerAccount,
    meta: {
      invalidatesQuery: QUERY_KEYS.marketer_management.base(),
    },
    onSuccess: (data) => {
      const message =
        data.message || "Marketer Delete Account Request Sent Successfully";
      openToast(message, "success");
    },
  });
};

export const useToggleMarketerStatus = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: toggleMarketerStatus,
    meta: {
      invalidatesQuery: QUERY_KEYS.marketer_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Marketer Status Toggled Successfully";
      openToast(message, "success");
    },
  });
};

export const useDeleteMarketerAccount = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: deleteMarketerAccount,
    meta: {
      invalidatesQuery: QUERY_KEYS.marketer_management.base(),
    },
    onSuccess: (data) => {
      const message =
        data.message || "Marketer Delete Request Handled Successfully";
      openToast(message, "success");
    },
  });
};

export const useToggleAdminStatus = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: toggleAdminStatus,
    meta: {
      invalidatesQuery: QUERY_KEYS.admin_management.base(),
    },
    onSuccess: (data) => {
      const message = data.message || "Admin Status Toggled Successfully";
      openToast(message, "success");
    },
  });
};

export const useDeleteAdminAccount = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: deleteAdminAccount,
    meta: {
      invalidatesQuery: QUERY_KEYS.admin_management.base(),
    },
    onSuccess: (data) => {
      const message =
        data.message || "Admin Delete Request Handled Successfully";
      openToast(message, "success");
    },
  });
};
