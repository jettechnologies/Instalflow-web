import {
  Box,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { LockIcon } from "@phosphor-icons/react";
import { Form, Formik } from "formik";
import { InputField } from "@components/forms/input-field";
import { useUpdateProduct } from "@services/tanstack-mutations/catalog";

import type { Product } from "@utils/types/response-type";

interface ProductPricingCardProps {
  product: Product;
}

export function ProductPricingCard({ product }: ProductPricingCardProps) {
  const updateProductMutation = useUpdateProduct(product.productId);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={6}>
      <Heading size="sm" mb={4}>
        Valuation &amp; Stock Inventory
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Price */}
        <Box>
          <Text fontSize="10px" color="textMuted" mb={1}>
            BASE PRICE (₦)
          </Text>
          {hasVariants ? (
            <Tooltip
              label="Price derived dynamically from active variations"
              placement="top">
              <HStack>
                <Input
                  isDisabled
                  value={`₦${product.minPrice?.toLocaleString()} – ₦${product.maxPrice?.toLocaleString()}`}
                  bg="bgLayer1"
                  borderColor="borderStructural"
                  borderRadius="12px"
                />
                <LockIcon size={16} color="orange" />
              </HStack>
            </Tooltip>
          ) : (
            <Formik
              initialValues={{ price: product.price }}
              onSubmit={async (values) => {
                await updateProductMutation.mutateAsync(values);
              }}>
              {(formik) => (
                <Form onBlur={formik.handleSubmit as any}>
                  <InputField name="price" type="number" placeholder="Price" />
                </Form>
              )}
            </Formik>
          )}
        </Box>

        {/* Stock */}
        <Box>
          <Text fontSize="10px" color="textMuted" mb={1}>
            TOTAL STOCK
          </Text>
          {hasVariants ? (
            <Tooltip
              label="Stock computed dynamically from variant levels"
              placement="top">
              <HStack>
                <Input
                  isDisabled
                  value={`${product.stockQuantity} units`}
                  bg="bgLayer1"
                  borderColor="borderStructural"
                  borderRadius="12px"
                />
                <LockIcon size={16} color="orange" />
              </HStack>
            </Tooltip>
          ) : (
            <Formik
              initialValues={{ stockQuantity: product.stockQuantity }}
              onSubmit={async (values) => {
                await updateProductMutation.mutateAsync(values);
              }}>
              {(formik) => (
                <Form onBlur={formik.handleSubmit as any}>
                  <InputField
                    name="stockQuantity"
                    type="number"
                    placeholder="Stock"
                  />
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
