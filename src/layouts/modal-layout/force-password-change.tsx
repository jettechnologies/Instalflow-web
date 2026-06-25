import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import { Button, VStack } from "@chakra-ui/react";
import { InputField } from "@components/forms/input-field";
import { ForcePasswordSchema } from "@utils/schema";
import { useForcePasswordChange } from "@services/tanstack-mutations/auth";
import { useNavigate } from "@tanstack/react-router";
import type { UserRole } from "@utils/types";
import { useAuth } from "@context/auth-provider";

export const ForcePasswordChangeModal = () => {
  const navigate = useNavigate();
  const { mutateAsync: forcePasswordChange, isPending } =
    useForcePasswordChange();

  const { user } = useAuth();

  const userRole = user?.role as UserRole;

  return (
    <ModalLayout
      isOpen={true}
      onClose={() => {}}
      title="Update Password"
      autoClose={false}
      size="md"
      py={6}
      noCloseButton>
      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={ForcePasswordSchema}
        onSubmit={async (values) => {
          const defaultRoutes: Record<UserRole, string> = {
            COMPANY: "/company/overview",
            ADMIN: "/company/overview",
            MARKETER: "/marketer/overview",
            CUSTOMER: "/customer/overview",
          };
          try {
            await forcePasswordChange(values);

            navigate({
              to: defaultRoutes[userRole],
            });
          } catch {}
        }}>
        {(formik) => (
          <VStack as={Form} spacing={4} align="stretch" mt={4}>
            <InputField
              password
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
            />

            <InputField
              password
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
            />

            <Button
              type="submit"
              mt={2}
              isLoading={formik.isSubmitting || isPending}
              loadingText="Updating Password...">
              Update Password
            </Button>
          </VStack>
        )}
      </Formik>
    </ModalLayout>
  );
};
