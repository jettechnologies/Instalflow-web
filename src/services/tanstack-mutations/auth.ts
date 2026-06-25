import { useMutation } from "@tanstack/react-query";
import {
  forcePasswordChange,
  forgotPassword,
  resetPassword,
} from "@services/mutations/auth";
import { useToastContext } from "@hooks/context";
import { localStorageHelper } from "@utils/helpers";

export const useForgotPassword = ({
  setEmailSubmitted,
}: {
  setEmailSubmitted: (email: string) => void;
}) => {
  const { openToast } = useToastContext();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, email) => {
      const message = data.message || "Forget Password Successful";
      setEmailSubmitted(email);
      localStorageHelper.set<{ email: string }>("IFL_USER_EMAIL", {
        email,
      });
      openToast(message, "success");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      openToast(errorMessage, "error");
    },

    meta: {
      errorMessage: "Failed to send password reset otp",
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    meta: {
      errorMessage: "Failed to reset password",
    },
  });
};

export const useForcePasswordChange = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: forcePasswordChange,
    meta: {
      errorMessage: "Failed to force reset password",
    },
    onSuccess: (data) => {
      const message = data.message || "Force Password Change Successful";
      openToast(message, "success");
    },
  });
};
