import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RightPanel } from "@components/auth/company-onboarding";
import { InputField } from "@components/forms/input-field";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  LightningIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";
import { useForgotPassword } from "@services/tanstack-mutations/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ForgotPasswordSchema } from "@utils/schema";
import { Form, Formik } from "formik";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const setEmailSubmitted = (email: string) => setSubmittedEmail(email);

  const { mutateAsync: forgetPassword, isPending } = useForgotPassword({
    setEmailSubmitted,
  });

  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      bg="var(--bg-layer-1)"
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
      {/* LEFT — form panel */}
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
            {/* Logo */}
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

            {submittedEmail ? (
              <VStack spacing={6} align="stretch">
                <Flex
                  w="56px"
                  h="56px"
                  borderRadius="16px"
                  bg="rgba(124,58,237,0.1)"
                  border="1px solid rgba(124,58,237,0.2)"
                  align="center"
                  justify="center">
                  <PaperPlaneTiltIcon
                    size={26}
                    color="var(--brand-primary)"
                    weight="duotone"
                  />
                </Flex>

                <VStack align="stretch" spacing={1}>
                  <Heading
                    size="lg"
                    color="var(--text-primary)"
                    fontWeight="800"
                    letterSpacing="-0.02em">
                    Check your inbox
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="var(--text-secondary)"
                    lineHeight="1.7">
                    We sent an Otp to{" "}
                    <Text
                      as="span"
                      color="var(--text-primary)"
                      fontWeight="600">
                      {submittedEmail}
                    </Text>
                    . If this email is registered, you'll receive it shortly.
                  </Text>
                </VStack>

                <Box
                  bg="var(--bg-layer-2)"
                  border="1px solid var(--border-structural)"
                  borderRadius="12px"
                  p={4}>
                  <Text
                    fontSize="xs"
                    color="var(--text-muted)"
                    lineHeight="1.7">
                    Didn't receive it? Check your spam folder, or{" "}
                    <Link
                      color="var(--brand-primary)"
                      fontWeight="600"
                      cursor="pointer"
                      onClick={() => setSubmittedEmail(null)}>
                      try a different email
                    </Link>
                    .
                  </Text>
                </Box>

                <Button
                  h="52px"
                  borderRadius="12px"
                  variant="ghost"
                  color="var(--text-secondary)"
                  border="1px solid var(--border-structural)"
                  _hover={{
                    bg: "var(--bg-layer-2)",
                    color: "var(--text-primary)",
                  }}
                  rightIcon={<ArrowRightIcon size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/reset-password",
                      search: { reset_password_view: "view_otp" },
                    })
                  }>
                  Go to Reset password
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
                    Forgot password?
                  </Heading>
                  <Text fontSize="sm" color="var(--text-secondary)">
                    Enter your corporate email and we'll send a reset link.
                  </Text>
                </VStack>

                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={ForgotPasswordSchema}
                  onSubmit={async ({ email }, { setSubmitting }) => {
                    try {
                      await forgetPassword(email);
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
                          icon={
                            <EnvelopeSimpleIcon
                              size={18}
                              color="var(--icon-dark)"
                            />
                          }
                        />

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
                          rightIcon={<PaperPlaneTiltIcon size={18} />}>
                          Send Reset Otp
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
                          onClick={() => navigate({ to: "/login" })}>
                          Back to sign in
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

      <Box
        display={{ base: "none", md: "block" }}
        order={{ base: 1, md: 2 }}
        position="sticky"
        top={0}
        h="100vh">
        <RightPanel view="forgot-password" />
      </Box>
    </Box>
  );
}
