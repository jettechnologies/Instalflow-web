import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  HStack,
  Text,
  VStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";

export interface OTPFormValues {
  otp: string;
}

export interface OTPFormProps {
  otpLength?: number;
  submitText?: string;
  onSubmit: (values: OTPFormValues) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const OTPForm = ({
  otpLength = 6,
  submitText = "Verify OTP",
  onSubmit,
  onSuccess,
  onError,
}: OTPFormProps) => {
  return (
    <Formik
      initialValues={{
        otp: "",
      }}
      validationSchema={Yup.object({
        otp: Yup.string()
          .length(otpLength, `OTP must be ${otpLength} digits`)
          .required("OTP is required"),
      })}
      onSubmit={async (values, helpers) => {
        try {
          await onSubmit(values);
          setTimeout(() => onSuccess?.(), 2000);

          helpers.resetForm();
        } catch (err) {
          onError?.(err as Error);
        } finally {
          helpers.setSubmitting(false);
        }
      }}>
      {(formik) => {
        const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();

          const digits = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, otpLength);

          formik.setFieldValue("otp", digits);
        };

        return (
          <VStack as={Form} gap="6" width="full">
            <VStack gap="3">
              <HStack justify="center">
                <Field name="otp" onPaste={handlePaste}>
                  {({ meta }: any) => (
                    <PinInput
                      otp
                      value={formik.values.otp}
                      onChange={(value) => formik.setFieldValue("otp", value)}>
                      {Array.from({
                        length: otpLength,
                      }).map((_, index) => (
                        <PinInputField
                          key={index}
                          width="60px"
                          height="60px"
                          fontSize="24px"
                          borderColor={
                            meta.error && meta.touched
                              ? "var(--status-danger)"
                              : "var(--border-structural)"
                          }
                          bg="var(--bg-layer-2)"
                          color="var(--text-primary)"
                          _focus={{
                            borderColor: "var(--brand-primary)",
                          }}
                        />
                      ))}
                    </PinInput>
                  )}
                </Field>
              </HStack>

              <ErrorMessage name="otp">
                {(message) => (
                  <Text
                    color="var(--status-danger)"
                    fontSize="sm"
                    fontWeight="500">
                    {message}
                  </Text>
                )}
              </ErrorMessage>
            </VStack>

            <Button
              type="submit"
              width="full"
              isLoading={formik.isSubmitting}
              disabled={formik.values.otp.length !== otpLength}
              bg="var(--brand-primary)"
              color="white"
              _hover={{
                opacity: 0.9,
              }}>
              {submitText}
            </Button>
          </VStack>
        );
      }}
    </Formik>
  );
};
