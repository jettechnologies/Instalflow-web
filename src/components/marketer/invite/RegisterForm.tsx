import { Formik, Form } from "formik";
import { VStack, Button, Text } from "@chakra-ui/react";
import { registerSchema, type RegisterFormValues } from "@utils/schema/invite";
import type { RegisterPayload } from "../../../utils/types/invite";
import { InputField } from "@components/forms/input-field";

interface RegisterFormProps {
  defaultRef?: string;
  isSubmitting: boolean;
  onSubmit: (values: RegisterPayload) => void;
}

export function RegisterForm({
  defaultRef,
  isSubmitting,
  onSubmit,
}: RegisterFormProps) {
  return (
    <Formik<RegisterFormValues>
      initialValues={{
        name: "",
        email: "",
        password: "",
        referredByCode: defaultRef ?? "",
      }}
      validationSchema={registerSchema}
      onSubmit={(values) => onSubmit(values)}>
      {() => (
        <Form>
          <VStack align="stretch" spacing={4}>
            <InputField
              name="name"
              label="Full legal name"
              placeholder="Ngozi Iwu"
            />
            <InputField
              name="email"
              label="Email"
              placeholder="you@example.com"
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              password
              autoComplete="new-password"
            />
            <InputField
              name="referredByCode"
              label="Referral code"
              placeholder="IFL-REF-…"
              isDisabled={Boolean(defaultRef)}
            />
            <Button type="submit" isLoading={isSubmitting} mt={2}>
              Continue to KYC
            </Button>
            <Text fontSize="11px" color="textMuted" textAlign="center">
              By continuing, you consent to a soft credit check and BVN
              verification.
            </Text>
          </VStack>
        </Form>
      )}
    </Formik>
  );
}
