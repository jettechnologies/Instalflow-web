import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RightPanel } from "@components/auth/company-onboarding";
import { OTPForm } from "@components/auth/otp-form";
import { InputField } from "@components/forms/input-field";
import { useToastContext } from "@hooks/context";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LightningIcon,
  LockKeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { useResetPassword } from "@services/tanstack-mutations/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { localStorageHelper } from "@utils/helpers";
import { ResetPasswordSchema, ResetPasswordSearchSchema } from "@utils/schema";
import { Form, Formik } from "formik";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/reset-password")({
  validateSearch: (search) => {
    return ResetPasswordSearchSchema.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { reset_password_view } = Route.useSearch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { openToast } = useToastContext();

  const saveToken = (token: string) => setToken(token);

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const navigate = useNavigate();

  const { email: clientEmail } =
    localStorageHelper.get<{ email: string }>("IFL_USER_EMAIL") ?? {};

  return (
    <Box
      minH="100vh"
      bg="var(--bg-layer-1)"
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
      <Box
        bg="var(--bg-layer-1)"
        borderRight={{
          base: "none",
          md: "1px solid var(--border-structural)",
        }}
        order={{ base: 2, md: 1 }}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="full"
          minH="100vh"
          px={{ base: 6, md: 12 }}
          py={10}>
          <Box w="full" maxW="480px">
            <HStack mb={10} spacing={2}>
              <Flex
                w="36px"
                h="36px"
                borderRadius="10px"
                background="var(--brand-gradient)"
                align="center"
                justify="center">
                <LightningIcon size={18} color="#fff" weight="fill" />
              </Flex>
              <Text
                fontWeight="800"
                fontSize="lg"
                color="var(--text-primary)"
                letterSpacing="-0.02em">
                InstalFlow
              </Text>
            </HStack>

            {}

            {reset_password_view === "view_otp" ? (
              <OTPForm
                otpLength={6}
                onSubmit={async ({ otp }) => saveToken(otp)}
                onSuccess={() => {
                  navigate({
                    to: ".",
                    search: (prev) => ({
                      ...prev,
                      reset_password_view: "reset_password",
                    }),
                  });
                }}
              />
            ) : isSuccess && reset_password_view === "reset_password" ? (
              <VStack spacing={6} align="stretch">
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="16px"
                  bg="rgba(16,185,129,0.1)"
                  border="1px solid rgba(16,185,129,0.2)"
                  align="center"
                  justify="center">
                  <ShieldCheckIcon
                    size={26}
                    color="var(--status-success)"
                    weight="duotone"
                  />
                </Flex>

                <VStack align="stretch" spacing={1}>
                  <Heading
                    size="lg"
                    color="var(--text-primary)"
                    fontWeight="800"
                    letterSpacing="-0.02em">
                    Password updated
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="var(--text-secondary)"
                    lineHeight="1.7">
                    Your password has been reset successfully. All previous
                    sessions have been revoked. You'll be redirected to the
                    sign-in page in a moment.
                  </Text>
                </VStack>

                <Box
                  bg="var(--bg-layer-2)"
                  border="1px solid var(--border-structural)"
                  borderRadius="12px"
                  p={4}>
                  <HStack spacing={3}>
                    <CheckCircleIcon
                      size={16}
                      color="var(--status-success)"
                      weight="fill"
                    />
                    <Text fontSize="xs" color="var(--text-muted)">
                      Redirecting you to sign in…
                    </Text>
                  </HStack>
                </Box>

                <Button
                  h="52px"
                  borderRadius="12px"
                  background="var(--brand-gradient)"
                  color="white"
                  fontSize="sm"
                  fontWeight="700"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => navigate({ to: "/login" })}>
                  Go to Sign In now
                </Button>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                <VStack align="stretch" spacing={1}>
                  <Heading
                    size="lg"
                    color="var(--text-primary)"
                    fontWeight="800"
                    letterSpacing="-0.02em">
                    Set new password
                  </Heading>
                  <Text fontSize="sm" color="var(--text-secondary)">
                    Creating a new password for{" "}
                    <Text
                      as="span"
                      color="var(--text-primary)"
                      fontWeight="600">
                      {clientEmail}
                    </Text>
                    . Choose something strong.
                  </Text>
                </VStack>

                <Formik
                  initialValues={{ newPassword: "", confirmPassword: "" }}
                  validationSchema={ResetPasswordSchema}
                  onSubmit={async ({ newPassword }, { setSubmitting }) => {
                    if (!clientEmail || clientEmail === "") {
                      openToast("Email Not Found", "error");
                      setTimeout(() => navigate({ to: "/forgot-password" }));

                      return;
                    } else if (token === null) {
                      navigate({
                        to: ".",
                        search: (prev) => ({
                          ...prev,
                          reset_password_view: "view_otp",
                        }),
                      });

                      return;
                    }
                    try {
                      await resetPassword(
                        { email: clientEmail, token, newPassword },
                        {
                          onSuccess: () => {
                            setIsSuccess(true);
                            setTimeout(() => navigate({ to: "/login" }), 3000);
                          },
                        }
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}>
                  {({ isSubmitting }) => (
                    <Form style={{ width: "100%" }}>
                      <VStack spacing={5} align="stretch">
                        <InputField
                          name="newPassword"
                          label="New Password"
                          type="password"
                          password
                          placeholder="••••••••"
                          icon={
                            <LockKeyIcon size={18} color="var(--icon-dark)" />
                          }
                        />
                        <InputField
                          name="confirmPassword"
                          label="Confirm New Password"
                          type="password"
                          password
                          placeholder="••••••••"
                          icon={
                            <LockKeyIcon size={18} color="var(--icon-dark)" />
                          }
                        />

                        <Box
                          bg="var(--bg-layer-2)"
                          border="1px solid var(--border-structural)"
                          borderRadius="10px"
                          px={4}
                          py={3}>
                          <VStack align="stretch" spacing={1}>
                            {[
                              "At least 6 characters",
                              "Both fields must match",
                            ].map((rule) => (
                              <HStack key={rule} spacing={2}>
                                <CheckCircleIcon
                                  size={12}
                                  color="var(--text-muted)"
                                />
                                <Text fontSize="11px" color="var(--text-muted)">
                                  {rule}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>

                        <Button
                          type="submit"
                          isLoading={isSubmitting || isPending}
                          h="52px"
                          borderRadius="12px"
                          background="var(--brand-gradient)"
                          color="white"
                          fontSize="sm"
                          fontWeight="700"
                          _hover={{ opacity: 0.9 }}
                          _active={{ opacity: 0.85 }}
                          rightIcon={<ShieldCheckIcon size={18} />}>
                          Reset Password
                        </Button>

                        <Button
                          h="50px"
                          borderRadius="12px"
                          variant="ghost"
                          color="var(--text-secondary)"
                          border="1px solid var(--border-structural)"
                          _hover={{
                            bg: "var(--bg-layer-2)",
                            color: "var(--text-primary)",
                          }}
                          leftIcon={<ArrowLeftIcon size={16} />}
                          onClick={() => navigate({ to: "/forgot-password" })}>
                          Request a Otp
                        </Button>
                      </VStack>
                    </Form>
                  )}
                </Formik>
              </VStack>
            )}
          </Box>
        </Flex>
      </Box>

      {/* RIGHT — illustration */}
      <Box
        display={{ base: "none", md: "block" }}
        order={{ base: 1, md: 2 }}
        position="sticky"
        top={0}
        h="100vh">
        <RightPanel view="reset-password" />
      </Box>
    </Box>
  );
}
