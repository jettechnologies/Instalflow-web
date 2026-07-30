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
import type { UserData } from "@containers/onboarding-flow";
import { useMemo } from "react";

interface Step1Props {
  userData: UserData | null;
  onSuccess: (data: {
    companyName: string;
    adminName: string;
    email: string;
    password: string;
  }) => void;
}

export const Step1Identity = ({ onSuccess, userData }: Step1Props) => {
  const initialValues = useMemo(
    () =>
      userData
        ? userData
        : { companyName: "", adminName: "", email: "", password: "" },
    [userData]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Step1Schema}
      onSubmit={(vals) => onSuccess(vals)}
      enableReinitialize>
      {() => (
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
