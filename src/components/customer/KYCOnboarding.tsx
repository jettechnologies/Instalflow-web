import { useState } from "react";
import { Formik, Form, Field, type FieldProps } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  Text,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@services/api-service";

const StepOneValidation = Yup.object().shape({
  name: Yup.string().required("Legal identity parameter required"),
  email: Yup.string()
    .email("Invalid string mapping structure")
    .required("Active communication channel required"),
  password: Yup.string()
    .min(6, "Security criteria bounds require 6 elements minimum")
    .required("Password value execution entry required"),
  referredByCode: Yup.string().required(
    "Affiliate node designation signature must be present dynamically"
  ),
});

export default function KYCOnboarding() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [internalOnboardingToken, setInternalOnboardingToken] =
    useState<string>("");
  const [stagedDocument, setStagedDocument] = useState<File | null>(null);
  const displayNotification = useToast();

  const registerConsumerNode = useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiService.post<{ onboardingToken: string }>(
        "/kyc/register",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      setInternalOnboardingToken(data.onboardingToken);
      setActiveStep(2);
      displayNotification({
        title: "Consumer Registered",
        description: "Direct tracking node initialized.",
        status: "success",
        duration: 3000,
      });
    },
    meta: {
      errorMessage:
        "User node generation mapping rejected system credential formatting configurations.",
    },
  });

  const uploadRiskParameters = useMutation({
    mutationFn: async (formValues: any) => {
      const conceptualPayload = new FormData();
      conceptualPayload.append(
        "productId",
        "671c2e10-7e63-40c5-9ea2-2941b3c9c328"
      );
      conceptualPayload.append(
        "variantId",
        "8c9f294b-8e85-4797-bdf5-6d0a3ecaa25c"
      );
      conceptualPayload.append(
        "installmentPlanId",
        "111c2e10-7e63-40c5-9ea2-2941b3c9c111"
      );
      conceptualPayload.append("idType", formValues.idType);
      conceptualPayload.append("idNumber", formValues.idNumber);
      if (stagedDocument) {
        conceptualPayload.append("bankStatement", stagedDocument);
      }

      const response = await apiService.post("/kyc/submit", conceptualPayload, {
        headers: {
          Authorization: `Bearer ${internalOnboardingToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
      displayNotification({
        title: "KYC Submitted Successfully",
        description: "Government database match sequence queued.",
        status: "success",
        duration: 3000,
      });
    },
    meta: {
      errorMessage:
        "Document file upload rejected. File stream exceeds constraints or formatting requirements.",
    },
  });

  if (activeStep === 1) {
    return (
      <Box
        minH="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}>
        <Box
          w="full"
          maxW="md"
          p={8}
          bg="var(--bg-layer-2)"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="var(--border-structural)">
          <Heading size="sm" mb={1} color="var(--text-primary)">
            Consumer Account Creation
          </Heading>
          <Text fontSize="xs" color="var(--text-secondary)" mb={6}>
            Register tracking profiles to access system amortization lines.
          </Text>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              referredByCode: "IFL-REF-JOHNMARKETER-A8786D",
            }}
            validationSchema={StepOneValidation}
            onSubmit={(values) => registerConsumerNode.mutate(values)}>
            {({ errors, touched }) => (
              <Form>
                <VStack spacing={4}>
                  <Field name="name">
                    {({ field }: FieldProps) => (
                      <FormControl isInvalid={!!errors.name && touched.name}>
                        <FormLabel fontSize="xs" color="var(--text-secondary)">
                          Legal Name String
                        </FormLabel>
                        <Input
                          {...field}
                          fontSize="sm"
                          bg="var(--bg-layer-1)"
                          color="var(--text-primary)"
                          borderColor="var(--border-structural)"
                          borderRadius="xl"
                        />
                        <FormErrorMessage fontSize="xs">
                          {errors.name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field }: FieldProps) => (
                      <FormControl isInvalid={!!errors.email && touched.email}>
                        <FormLabel fontSize="xs" color="var(--text-secondary)">
                          Communication Inbox Location
                        </FormLabel>
                        <Input
                          type="email"
                          {...field}
                          fontSize="sm"
                          bg="var(--bg-layer-1)"
                          color="var(--text-primary)"
                          borderColor="var(--border-structural)"
                          borderRadius="xl"
                        />
                        <FormErrorMessage fontSize="xs">
                          {errors.email}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field }: FieldProps) => (
                      <FormControl
                        isInvalid={!!errors.password && touched.password}>
                        <FormLabel fontSize="xs" color="var(--text-secondary)">
                          Access Credential Strategy
                        </FormLabel>
                        <Input
                          type="password"
                          {...field}
                          fontSize="sm"
                          bg="var(--bg-layer-1)"
                          color="var(--text-primary)"
                          borderColor="var(--border-structural)"
                          borderRadius="xl"
                        />
                        <FormErrorMessage fontSize="xs">
                          {errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="referredByCode">
                    {({ field }: FieldProps) => (
                      <FormControl isReadOnly>
                        <FormLabel fontSize="xs" color="var(--text-muted)">
                          Marketing Attribution Signature
                        </FormLabel>
                        <Input
                          {...field}
                          fontSize="sm"
                          bg="var(--border-structural)"
                          color="var(--text-secondary)"
                          borderColor="var(--border-structural)"
                          borderRadius="xl"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    isLoading={registerConsumerNode.isPending}
                    w="full"
                    h="44px"
                    borderRadius="xl"
                    bgGradient="var(--brand-gradient)"
                    color="var(--text-primary)"
                    fontSize="sm"
                    fontWeight="600">
                    Compile Profile Context
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    );
  }

  if (activeStep === 2) {
    return (
      <Box
        minH="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}>
        <Box
          w="full"
          maxW="md"
          p={8}
          bg="var(--bg-layer-2)"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="var(--border-structural)">
          <Heading size="sm" mb={1} color="var(--text-primary)">
            Risk Evaluation Verification
          </Heading>
          <Text fontSize="xs" color="var(--text-secondary)" mb={6}>
            Provide government database indexes to continue verification checks.
          </Text>
          <Formik
            initialValues={{ idType: "BVN", idNumber: "" }}
            onSubmit={(values) => uploadRiskParameters.mutate(values)}>
            {() => (
              <Form>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="xs" color="var(--text-secondary)">
                      Verification Directory Index
                    </FormLabel>
                    <Select
                      name="idType"
                      fontSize="sm"
                      bg="var(--bg-layer-1)"
                      color="var(--text-primary)"
                      borderColor="var(--border-structural)"
                      borderRadius="xl">
                      <option value="BVN">
                        Bank Verification Network (BVN)
                      </option>
                      <option value="NIN">
                        National Identity Number (NIN)
                      </option>
                      <option value="PASSPORT">
                        International Travel Passport
                      </option>
                    </Select>
                  </FormControl>
                  <Field name="idNumber">
                    {({ field }: FieldProps) => (
                      <FormControl>
                        <FormLabel fontSize="xs" color="var(--text-secondary)">
                          Physical Document Registry String
                        </FormLabel>
                        <Input
                          {...field}
                          fontSize="sm"
                          bg="var(--bg-layer-1)"
                          color="var(--text-primary)"
                          borderColor="var(--border-structural)"
                          borderRadius="xl"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <FormControl>
                    <FormLabel fontSize="xs" color="var(--text-secondary)">
                      Verification Statements (.PDF Limit 10MB)
                    </FormLabel>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setStagedDocument(e.target.files[0]);
                        }
                      }}
                      display="flex"
                      alignItems="center"
                      pt={1}
                      fontSize="sm"
                      bg="var(--bg-layer-1)"
                      color="var(--text-primary)"
                      borderColor="var(--border-structural)"
                      borderRadius="xl"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    isLoading={uploadRiskParameters.isPending}
                    w="full"
                    h="44px"
                    borderRadius="xl"
                    bgGradient="var(--brand-gradient)"
                    color="var(--text-primary)"
                    fontSize="sm"
                    fontWeight="600">
                    Stream Risk Context Parameters
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}>
      <Box
        w="full"
        maxW="md"
        p={8}
        bg="var(--bg-layer-2)"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="var(--border-structural)"
        textAlign="center">
        <Box
          display="inline-block"
          px={3}
          py={1}
          mb={4}
          borderRadius="full"
          fontSize="10px"
          bg="rgba(245, 158, 11, 0.12)"
          color="var(--status-warning)"
          fontWeight="700"
          letterSpacing="wider">
          PLATFORM STATE: PENDING AUDIT
        </Box>
        <Heading size="md" mb={2} color="var(--text-primary)" fontWeight="700">
          Underwriting Evaluation Engaged
        </Heading>
        <Text fontSize="xs" color="var(--text-secondary)" lineHeight="relaxed">
          Risk profiles map across validation indexes automatically. Data
          clearing workflows complete within 3 business days. Authorized runtime
          parameters will dispatch automatically to the consumer configuration
          inbox.
        </Text>
      </Box>
    </Box>
  );
}
