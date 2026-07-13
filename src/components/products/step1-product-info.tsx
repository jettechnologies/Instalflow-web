import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { FieldArray, Form, Formik } from "formik";
import { InputField, TextAreaField } from "@components/forms/input-field";
import * as Yup from "yup";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@services/tanstack-mutations/catalog";
import type { Category, Product } from "@utils/types/response-type";
import { SelectField } from "@components/forms/select";
import { CreateCategoryModal } from "@layouts/modal-layout/create-category";

export const step1Schema = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  description: Yup.string().trim().nullable(),
  categoryId: Yup.string().required("Category is required"),
  commissionRate: Yup.number()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%")
    .required("Commission rate is required"),
  price: Yup.number()
    .min(0, "Minimum price is 0")
    .required("Base price is required"),
  stockQuantity: Yup.number()
    .integer("Must be an integer")
    .min(0, "Minimum stock is 0")
    .required("Base stock quantity is required"),
  installmentPlans: Yup.array().of(
    Yup.object({
      durationMonths: Yup.number()
        .integer()
        .min(1, "Minimum 1 month")
        .required("Duration is required"),
      interestPercentage: Yup.number()
        .min(0, "Minimum 0%")
        .max(100, "Maximum 100%")
        .required("Interest rate is required"),
      active: Yup.boolean().default(true),
    })
  ),
});

interface Step1ProductInfoProps {
  categories: Category[];
  product?: Product;
  onComplete: (productId: string) => void;
}

export function Step1ProductInfo({
  categories,
  product,
  onComplete,
}: Step1ProductInfoProps) {
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct(product?.productId ?? "");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const categoryOptions = categories.map((c) => ({
    value: c.categoryId,
    label: c.name,
  }));

  const initialValues = {
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    commissionRate: product?.commissionRate ?? 0,
    price: product?.price ?? 0,
    stockQuantity: product?.stockQuantity ?? 0,
    installmentPlans: product?.installmentPlans?.map((p) => ({
      durationMonths: p.durationMonths,
      interestPercentage: p.interestPercentage,
      active: p.active,
    })) ?? [{ durationMonths: 12, interestPercentage: 8.5, active: true }],
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={step1Schema}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            if (product?.productId) {
              await updateProductMutation.mutateAsync({
                name: values.name,
                description: values.description,
                categoryId: values.categoryId,
                commissionRate: values.commissionRate,
                price: values.price,
                stockQuantity: values.stockQuantity,
              });
              onComplete(product.productId);
            } else {
              const res = await createProductMutation.mutateAsync({
                ...values,
                status: "DRAFT",
              });
              if (res?.data?.productId) {
                onComplete(res.data.productId);
              }
            }
          } catch (_) {}
        }}>
        {(formik) => {
          return (
            <Form>
              <VStack spacing={6} align="stretch">
                <Heading size="sm">
                  Step 1: Product Specifications &amp; Installment Plans
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <InputField
                    name="name"
                    label="Product Name"
                    placeholder="e.g. iPhone 16 Pro"
                  />
                  <HStack spacing="6px" alignItems="flex-start">
                    <SelectField
                      name="categoryId"
                      label="Category"
                      placeholder="Select Category"
                      options={categoryOptions}
                    />
                    <IconButton
                      aria-label="Add Category"
                      icon={<PlusIcon size={16} />}
                      variant="ghostOutline"
                      size="md"
                      mt={6}
                      onClick={onOpen}
                    />
                  </HStack>
                </SimpleGrid>

                <TextAreaField
                  name="description"
                  label="Description"
                  placeholder="Product descriptions, hardware specs..."
                  height="100px"
                />

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <InputField
                    name="price"
                    type="number"
                    label="Base Price (₦)"
                    placeholder="0.00"
                    isDisabled={!!product?.variants?.length}
                  />
                  <InputField
                    name="stockQuantity"
                    type="number"
                    label="Base Stock Quantity"
                    placeholder="0"
                    isDisabled={!!product?.variants?.length}
                  />
                  <InputField
                    name="commissionRate"
                    type="number"
                    label="Commission Rate (%)"
                    placeholder="5.5"
                  />
                </SimpleGrid>

                {product?.variants && product.variants.length > 0 && (
                  <Box p={3} bg="whiteAlpha.50" borderRadius="xl">
                    <Text fontSize="xs" color="textSecondary">
                      ⚠️ Price and Stock are disabled — values are derived
                      dynamically from active variant rows.
                    </Text>
                  </Box>
                )}

                <Divider borderColor="borderStructural" />

                {/* Installment Plans builder */}
                <VStack align="stretch" spacing={3}>
                  <Heading size="xs">Installment Financing Plans</Heading>
                  <Text fontSize="xs" color="textSecondary">
                    Attach available installment scopes. Monthly breakdowns are
                    derived from variant base costs.
                  </Text>

                  <FieldArray name="installmentPlans">
                    {(helpers) => (
                      <VStack align="stretch" spacing={3}>
                        {formik.values.installmentPlans.map((_, index) => (
                          <HStack key={index} spacing={3} align="flex-end">
                            <InputField
                              name={`installmentPlans.${index}.durationMonths`}
                              type="number"
                              label={index === 0 ? "Duration (Months)" : ""}
                              placeholder="12"
                            />
                            <InputField
                              name={`installmentPlans.${index}.interestPercentage`}
                              type="number"
                              label={index === 0 ? "Interest Rate (%)" : ""}
                              placeholder="8.5"
                            />
                            <IconButton
                              icon={
                                <TrashIcon
                                  size={16}
                                  color="var(--status-danger)"
                                />
                              }
                              aria-label="delete-installment-plans"
                              bg="white"
                              variant="outline"
                              colorScheme="danger"
                              h="44px"
                              onClick={() => helpers.remove(index)}
                              isDisabled={
                                formik.values.installmentPlans.length <= 1
                              }
                            />
                          </HStack>
                        ))}
                        <Button
                          leftIcon={<PlusIcon size={14} />}
                          variant="ghostOutline"
                          size="sm"
                          alignSelf="flex-start"
                          onClick={() =>
                            helpers.push({
                              durationMonths: 12,
                              interestPercentage: 5,
                              active: true,
                            })
                          }>
                          Add Plan Option
                        </Button>
                      </VStack>
                    )}
                  </FieldArray>
                </VStack>

                <Divider borderColor="borderStructural" />

                <HStack justify="flex-end" pt={4}>
                  <Button
                    type="submit"
                    isLoading={formik.isSubmitting}
                    loadingText="Saving..."
                    rightIcon={<ArrowRightIcon size={16} />}>
                    Save &amp; Continue
                  </Button>
                </HStack>
              </VStack>
            </Form>
          );
        }}
      </Formik>

      {/* Modals */}
      <CreateCategoryModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
