// ─────────────────────────────────────────────────────────────────────────────
// Create Variant Modal — uses global ModalLayout component
// ─────────────────────────────────────────────────────────────────────────────
import { Button, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { InputField } from "@components/forms/input-field";
import { useCreateVariant } from "@services/tanstack-mutations/catalog";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
import { useQueryClient } from "@tanstack/react-query";

const schema = Yup.object({
  sku: Yup.string().required("SKU is required"),
  price: Yup.number().min(0).required("Price is required"),
  stockQuantity: Yup.number().integer().min(0).required("Stock is required"),
  size: Yup.string(),
  color: Yup.string(),
});

interface CreateVariantModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVariantModal({
  productId,
  isOpen,
  onClose,
}: CreateVariantModalProps) {
  const queryClient = useQueryClient();
  const createVariantMutation = useCreateVariant(productId);

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Add Variation"
      subTitle="Provide SKU, pricing, and inventory details for this variant."
      size="md"
    >
      <Formik
        initialValues={{
          sku: "",
          price: "",
          stockQuantity: "",
          size: "",
          color: "",
        }}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createVariantMutation.mutateAsync({
              sku: values.sku,
              price: parseFloat(values.price),
              stockQuantity: parseInt(values.stockQuantity),
              size: values.size,
              color: values.color ? [values.color] : [],
              isActive: true,
            });
            resetForm();
            onClose();
            queryClient.invalidateQueries(
              getProductDetailsQueryOptions(productId) as any
            );
          } catch (_) {}
        }}
      >
        {(formik) => (
          <Form>
            <VStack spacing={4}>
              <InputField name="sku" label="Variant SKU" placeholder="e.g. IPHONE-BLK-256" />
              <InputField name="price" type="number" label="Price (₦)" placeholder="0.00" />
              <InputField
                name="stockQuantity"
                type="number"
                label="Stock Quantity"
                placeholder="10"
              />
              <InputField name="size" label="Size / Spec" placeholder="e.g. 256GB, Large" />
              <InputField name="color" label="Color Tag" placeholder="e.g. Black Titanium" />
              <Button
                type="submit"
                w="full"
                isLoading={formik.isSubmitting}
              >
                Save Variant
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </ModalLayout>
  );
}
