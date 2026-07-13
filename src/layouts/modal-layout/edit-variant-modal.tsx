// ─────────────────────────────────────────────────────────────────────────────
// Edit Variant Modal — uses global ModalLayout component
// ─────────────────────────────────────────────────────────────────────────────
import { Button, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { InputField } from "@components/forms/input-field";
import { useUpdateVariant } from "@services/tanstack-mutations/catalog";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
import { useQueryClient } from "@tanstack/react-query";

const schema = Yup.object({
  price: Yup.number().min(0).required("Price is required"),
  stockQuantity: Yup.number().integer().min(0).required("Stock is required"),
  size: Yup.string(),
  color: Yup.string(),
});

export interface VariantForEdit {
  variantId: string;
  sku: string;
  price: number;
  stockQuantity: number;
  size?: string | null;
  color?: string[] | null;
}

interface EditVariantModalProps {
  productId: string;
  variant: VariantForEdit | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditVariantModal({
  productId,
  variant,
  isOpen,
  onClose,
}: EditVariantModalProps) {
  const queryClient = useQueryClient();
  const updateVariantMutation = useUpdateVariant(
    productId,
    variant?.variantId ?? ""
  );

  if (!variant) return null;

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Variant: ${variant.sku}`}
      subTitle="Update pricing, stock, and attribute details."
      size="md">
      <Formik
        initialValues={{
          price: String(variant.price),
          stockQuantity: String(variant.stockQuantity),
          size: variant.size ?? "",
          color: variant.color?.join(", ") ?? "",
        }}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            await updateVariantMutation.mutateAsync({
              price: parseFloat(values.price),
              stockQuantity: parseInt(values.stockQuantity),
              size: values.size,
              color: values.color
                ? values.color.split(",").map((s) => s.trim())
                : [],
            });
            onClose();
            queryClient.invalidateQueries(
              getProductDetailsQueryOptions(productId) as any
            );
          } catch (_) {}
        }}>
        {(formik) => (
          <Form>
            <VStack spacing={4}>
              <InputField name="price" type="number" label="Price (₦)" />
              <InputField
                name="stockQuantity"
                type="number"
                label="Stock Quantity"
              />
              <InputField name="size" label="Size / Spec" />
              <InputField
                name="color"
                label="Color Tags (comma-separated)"
                placeholder="e.g. Black, Silver"
              />
              <Button type="submit" w="full" isLoading={formik.isSubmitting}>
                Save Changes
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </ModalLayout>
  );
}
