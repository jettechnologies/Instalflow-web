import { Button, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { InputField } from "@components/forms/input-field";
import { useCreateInstallmentPlan } from "@services/tanstack-mutations/catalog";

const schema = Yup.object({
  durationMonths: Yup.number()
    .integer()
    .min(1, "Minimum 1 month")
    .required("Duration is required"),
  interestPercentage: Yup.number()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%")
    .required("Interest rate is required"),
});

interface CreatePlanModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlanModal({
  productId,
  isOpen,
  onClose,
}: CreatePlanModalProps) {
  const createPlanMutation = useCreateInstallmentPlan(productId);

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Create Installment Option"
      subTitle="Define a financing duration and interest rate for customers."
      size="md">
      <Formik
        initialValues={{ durationMonths: "", interestPercentage: "" }}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createPlanMutation.mutateAsync({
              durationMonths: parseInt(values.durationMonths),
              interestPercentage: parseFloat(values.interestPercentage),
              active: true,
            });
            resetForm();
            onClose();
          } catch (_) {}
        }}>
        {(formik) => (
          <Form>
            <VStack spacing={4}>
              <InputField
                name="durationMonths"
                type="number"
                label="Duration (Months)"
                placeholder="12"
              />
              <InputField
                name="interestPercentage"
                type="number"
                label="Interest Percentage (%)"
                placeholder="8.5"
              />
              <Button
                type="submit"
                w="full"
                loadingText="Saving..."
                isLoading={formik.isSubmitting}>
                Save Plan
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </ModalLayout>
  );
}
