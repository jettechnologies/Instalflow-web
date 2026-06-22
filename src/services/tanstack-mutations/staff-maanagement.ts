import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import {
  inviteMarketer,
  createAdmin,
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
