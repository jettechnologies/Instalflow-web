import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  ChakraSelectField,
  InputField,
  TextAreaField,
} from "@components/forms/input-field";
import { useUpdateProduct } from "@services/tanstack-mutations/catalog";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, Product } from "@utils/types/response-type";

const metaSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  categoryId: Yup.string().required("Category is required"),
  commissionRate: Yup.number().required("Commission rate is required"),
});

interface ProductMetaCardProps {
  product: Product;
  categories: Category[];
}

export function ProductMetaCard({ product, categories }: ProductMetaCardProps) {
  const queryClient = useQueryClient();
  const updateProductMutation = useUpdateProduct(product.productId);
  const [isEditing, setIsEditing] = useState(false);

  const categoryOptions = categories.map((c) => ({
    value: c.categoryId,
    label: c.name,
  }));

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="sm">Product Metadata</Heading>
        <IconButton
          aria-label="Toggle edit mode"
          icon={<PencilSimpleIcon size={16} />}
          size="sm"
          variant={isEditing ? "solid" : "ghost"}
          onClick={() => setIsEditing(!isEditing)}
        />
      </HStack>

      {!isEditing ? (
        <VStack align="stretch" spacing={4}>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontSize="10px" color="textMuted">
                PRODUCT NAME
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {product.name}
              </Text>
            </Box>
            <Box>
              <Text fontSize="10px" color="textMuted">
                CATEGORY
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {product.category?.name ?? "Uncategorized"}
              </Text>
            </Box>
          </SimpleGrid>
          <Box>
            <Text fontSize="10px" color="textMuted">
              DESCRIPTION
            </Text>
            <Text fontSize="sm" color="textSecondary">
              {product.description ?? "No description provided."}
            </Text>
          </Box>
          <Box>
            <Text fontSize="10px" color="textMuted">
              COMMISSION RATE
            </Text>
            <Text fontSize="sm" fontWeight="600">
              {product.commissionRate}%
            </Text>
          </Box>
        </VStack>
      ) : (
        <Formik
          initialValues={{
            name: product.name,
            categoryId: product.categoryId,
            description: product.description ?? "",
            commissionRate: product.commissionRate,
          }}
          validationSchema={metaSchema}
          onSubmit={async (values) => {
            try {
              await updateProductMutation.mutateAsync(values);
              setIsEditing(false);
              queryClient.invalidateQueries(
                getProductDetailsQueryOptions(product.productId) as any
              );
            } catch (_) {}
          }}>
          {(formik) => (
            <Form>
              <VStack spacing={4} align="stretch">
                <InputField name="name" label="Product Name" />
                <ChakraSelectField
                  name="categoryId"
                  label="Category"
                  placeholder="Select Category"
                  options={categoryOptions}
                />
                <TextAreaField
                  name="description"
                  label="Description"
                  height="80px"
                />
                <InputField
                  name="commissionRate"
                  type="number"
                  label="Commission Rate (%)"
                />
                <HStack justify="flex-end" spacing={3}>
                  <Button
                    size="sm"
                    variant="ghostOutline"
                    onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    isLoading={formik.isSubmitting}>
                    Save Details
                  </Button>
                </HStack>
              </VStack>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
}
