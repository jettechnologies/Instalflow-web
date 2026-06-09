import { Formik, Form } from "formik";
import { InputField } from "@components/forms/input-field";
import { LoginSchema } from "@utils/schema/auth";
import { Button, Link, Text, VStack } from "@chakra-ui/react";
import {
  EnvelopeSimpleIcon,
  LockIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@context/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useToastContext } from "@hooks/context";
import type { UserRole } from "@utils/types";

interface LoginFormProps {
  onRegisterClick: () => void;
}

export const LoginForm = ({ onRegisterClick }: LoginFormProps) => {
  const { login } = useAuth();

  const { openToast } = useToastContext();
  const navigate = useNavigate();

  const handleRoleBasedRedirect = (userRoles: UserRole) => {
    switch (userRoles) {
      case "COMPANY":
        navigate({
          to: "/company",
        });
        return;
      case "ADMIN":
        navigate({
          to: "/company",
        });
        return;
      case "MARKETER":
        navigate({
          to: "/marketer",
        });
        return;
      case "CUSTOMER":
        navigate({
          to: "/customer",
        });

        return;

      default:
        navigate({
          to: "/login",
        });
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { profile } = await login(values.email, values.password);
          handleRoleBasedRedirect(profile.role);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.";

          openToast(errorMessage, "error");
        } finally {
          setSubmitting(false);
        }
      }}>
      {({ isSubmitting }) => (
        <Form style={{ width: "100%" }}>
          <VStack spacing={5} align="stretch">
            <InputField
              name="email"
              type="email"
              label="Corporate Email"
              placeholder="john@acme.com"
              icon={<EnvelopeSimpleIcon size={18} color="var(--icon-dark)" />}
            />
            <InputField
              name="password"
              type="password"
              label="Password"
              password
              placeholder="••••••••"
              icon={<LockIcon size={18} color="var(--icon-dark)" />}
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              h="52px"
              borderRadius="12px"
              background="var(--brand-gradient)"
              color="white"
              fontSize="sm"
              fontWeight="700"
              _hover={{ opacity: 0.9 }}
              mt={1}
              rightIcon={<SignInIcon size={18} />}>
              Sign In
            </Button>

            <VStack spacing={2}>
              <Text fontSize="xs" color="var(--text-muted)" textAlign="center">
                Don't have an account?{" "}
                <Link
                  color="var(--brand-primary)"
                  fontWeight="600"
                  onClick={onRegisterClick}
                  cursor="pointer">
                  Create one
                </Link>
              </Text>
              <Text fontSize="xs" color="var(--text-muted)" textAlign="center">
                Forgotten Your Password{" "}
                <Link
                  color="var(--brand-primary)"
                  fontWeight="600"
                  onClick={() =>
                    navigate({
                      to: "/forgot-password",
                    })
                  }
                  cursor="pointer">
                  Reset password
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};
