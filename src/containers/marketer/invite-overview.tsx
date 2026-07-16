import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  useInviteRegistration,
  useSubmitApplication,
} from "@services/tanstack-mutations/invite";
import { SuccessCard } from "@components/marketer/invite/SuccessCard";
import type { InviteStep, RegisterPayload } from "@utils/types/invite";
import type { InviteSearch, KycFormValues } from "@utils/schema/invite";
import { useInviteProduct } from "@services/tanstack-queries/invite";
import { InviteHeader, InviteLayout, InviteLogo } from "@layouts/index";
import { InviteHero } from "@components/marketer/invite/InviteHero";
import { OfferCard } from "@components/marketer/invite/OfferCard";
import { KycForm } from "@components/marketer/invite/KycForm";
import { RegisterForm } from "@components/marketer/invite/RegisterForm";
import { StepIndicator } from "@components/marketer/invite/StepIndicator";

interface InviteOverviewProps {
  search: InviteSearch;
}

export const InviteOverview = ({ search }: InviteOverviewProps) => {
  const productQuery = useInviteProduct(search.product);

  const [step, setStep] = useState<InviteStep>(1);
  const [onboardingToken, setOnboardingToken] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const registerMutation = useInviteRegistration();
  const submitMutation = useSubmitApplication(onboardingToken ?? "");

  if (step === 3 && submittedRef) {
    return <SuccessCard referenceId={submittedRef} />;
  }

  const handleRegister = async (values: RegisterPayload) => {
    const data = await registerMutation.mutateAsync(values);
    setOnboardingToken(data.onboardingToken);
    setStep(2);
  };

  const handleKyc = async (values: KycFormValues, file: File | null) => {
    if (!file) {
      return;
    }
    if (!productQuery.data) {
      return;
    }
    const data = await submitMutation.mutateAsync({
      productId: productQuery.data.productId,
      variantId: values.variantId,
      installmentPlanId: values.installmentPlanId,
      idType: values.idType,
      idNumber: values.idNumber ?? "",
      bankStatement: file,
    });
    setSubmittedRef(data.applicationId);
    setStep(3);
  };

  return (
    <Box minH="100vh" bg="bgLayer1">
      <InviteHeader>
        <InviteLogo />
      </InviteHeader>
      <InviteLayout>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          <Box>
            <InviteHero referralCode={search.ref} />

            {productQuery.isLoading ? (
              <Flex justify="center" py={10}>
                <Spinner color="brand.400" />
              </Flex>
            ) : productQuery.data ? (
              <OfferCard
                product={productQuery.data}
                variantId={search.variant}
              />
            ) : (
              <Box
                mt={8}
                bg="bgLayer2"
                border="1px dashed"
                borderColor="borderStructural"
                p={6}
                borderRadius="2xl">
                <Text fontSize="13px" color="textSecondary">
                  No product was selected. After registration, our team will
                  reach out to help you pick a financing plan.
                </Text>
              </Box>
            )}
          </Box>

          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl">
            <Flex justify="space-between" mb={4} align="center">
              <Box>
                <Text
                  fontSize="11px"
                  color="textMuted"
                  fontWeight={600}
                  letterSpacing="0.06em">
                  STEP {step} OF 2
                </Text>
                <Heading size="md" mt={1}>
                  {step === 1 ? "Create your account" : "Submit your KYC"}
                </Heading>
              </Box>
              <StepIndicator current={step} total={2} />
            </Flex>

            {step === 1 ? (
              <RegisterForm
                defaultRef={search.ref}
                isSubmitting={registerMutation.isPending}
                onSubmit={handleRegister}
              />
            ) : (
              <KycForm
                product={
                  productQuery.data as NonNullable<typeof productQuery.data>
                }
                defaultVariantId={search.variant}
                isSubmitting={submitMutation.isPending}
                onSubmit={handleKyc}
                onBack={() => setStep(1)}
              />
            )}
          </Box>
        </SimpleGrid>
      </InviteLayout>
    </Box>
  );
};
