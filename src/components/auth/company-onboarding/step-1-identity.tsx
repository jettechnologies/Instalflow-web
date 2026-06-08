import { Step1Schema } from "@utils/schema";
import { Formik, Form } from "formik";
import { VStack, Button } from "@chakra-ui/react";
import {
  BuildingsIcon,
  UserIcon,
  EnvelopeSimpleIcon,
  ArrowRightIcon,
  LockIcon,
} from "@phosphor-icons/react";
import { InputField } from "@components/forms/input-field";
import { useStartOnboarding } from "@services/tanstack-mutations/onboarding";

interface Step1Props {
  onSuccess: () => void;
}

export const Step1Identity = ({ onSuccess }: Step1Props) => {
  const { mutateAsync: startOnboarding, isPending } = useStartOnboarding();

  return (
    <Formik
      initialValues={{
        companyName: "",
        adminName: "",
        email: "",
        password: "",
      }}
      validationSchema={Step1Schema}
      onSubmit={async (vals) => await startOnboarding(vals).then(onSuccess)}>
      {({ isSubmitting }) => (
        <Form style={{ width: "100%" }}>
          <VStack spacing={5} align="stretch">
            <InputField
              name="companyName"
              label="Company Name"
              placeholder="Acme Technologies Ltd"
              icon={<BuildingsIcon size={18} color="var(--icon-dark)" />}
            />
            <InputField
              name="adminName"
              label="Administrator Full Name"
              placeholder="John Doe"
              icon={<UserIcon size={18} color="var(--icon-dark)" />}
            />
            <InputField
              name="email"
              type="email"
              label="Corporate Email"
              placeholder="john@acme.com"
              icon={<EnvelopeSimpleIcon size={18} color="var(--icon-dark)" />}
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              password
              placeholder="••••••••"
              icon={<LockIcon size={18} color="var(--icon-dark)" />}
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
              mt={1}
              rightIcon={<ArrowRightIcon size={18} />}>
              Continue to Plan Selection
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};
