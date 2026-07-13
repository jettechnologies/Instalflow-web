import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateProduct } from "@services/tanstack-mutations/catalog";
import type { Product, ProductImage } from "@utils/types/response-type";

interface Step5ReviewProps {
  productId: string;
  product?: Product;
  gallery: ProductImage[];
  onBack: () => void;
}

export function Step5Review({
  productId,
  product,
  gallery,
  onBack,
}: Step5ReviewProps) {
  const navigate = useNavigate();
  const updateProductMutation = useUpdateProduct(productId);

  const primaryImage = gallery.find((g) => g.isPrimary) ?? gallery[0];

  const handlePublish = async () => {
    try {
      await updateProductMutation.mutateAsync({ status: "PUBLISHED" });
      navigate({ to: "/company/products" });
    } catch (_) {}
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="sm">Step 5: Review &amp; Publish</Heading>
        <Text fontSize="xs" color="textSecondary" mt={1}>
          Review product catalog details before publishing live to partners.
        </Text>
      </Box>

      {product && (
        <VStack
          align="stretch"
          spacing={5}
          bg="bgLayer1"
          p={5}
          borderRadius="xl"
          border="1px solid"
          borderColor="borderStructural">
          <Flex direction={{ base: "column", md: "row" }} gap={5}>
            {primaryImage && (
              <Image
                src={primaryImage.imageUrl}
                alt="Primary Preview"
                w={{ base: "full", md: "150px" }}
                h="150px"
                objectFit="cover"
                borderRadius="xl"
              />
            )}
            <VStack align="stretch" spacing={2} flex={1}>
              <Heading size="md">{product.name}</Heading>
              <Text fontSize="xs" color="textSecondary">
                {product.description ?? "No description provided."}
              </Text>
              <HStack spacing={2} pt={2} flexWrap="wrap">
                <Badge colorScheme="yellow">DRAFT</Badge>
                <Badge colorScheme="purple">
                  Comm: {product.commissionRate}%
                </Badge>
                <Badge colorScheme="blue">
                  Category: {product.category?.name ?? "Uncategorized"}
                </Badge>
              </HStack>
            </VStack>
          </Flex>

          <Divider borderColor="borderStructural" />

          {/* Pricing summary */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box
              bg="bgLayer2"
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor="borderStructural">
              <Text fontSize="10px" color="textMuted">
                VALUATION RANGE
              </Text>
              <Text fontSize="md" fontWeight="bold" mt={1}>
                ₦
                {product.minPrice?.toLocaleString() ??
                  product.price.toLocaleString()}{" "}
                — ₦
                {product.maxPrice?.toLocaleString() ??
                  product.price.toLocaleString()}
              </Text>
            </Box>
            <Box
              bg="bgLayer2"
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor="borderStructural">
              <Text fontSize="10px" color="textMuted">
                TOTAL INVENTORY
              </Text>
              <Text fontSize="md" fontWeight="bold" mt={1}>
                {product.stockQuantity} units
              </Text>
            </Box>
            <Box
              bg="bgLayer2"
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor="borderStructural">
              <Text fontSize="10px" color="textMuted">
                INSTALLMENT TERMS
              </Text>
              <Text fontSize="md" fontWeight="bold" mt={1}>
                {product.installmentPlans?.length ?? 0} active plans
              </Text>
            </Box>
          </SimpleGrid>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xs" fontWeight="bold" color="textSecondary">
                Product Variations:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {product.variants.map((v) => (
                  <HStack
                    key={v.variantId}
                    p={3}
                    bg="bgLayer2"
                    borderRadius="lg"
                    justify="space-between"
                    border="1px solid"
                    borderColor="borderStructural">
                    <VStack align="stretch" spacing={0}>
                      <Text fontSize="xs" fontWeight="bold">
                        {v.sku}
                      </Text>
                      <Text fontSize="10px" color="textSecondary">
                        Size: {v.size ?? "-"} | Color:{" "}
                        {v.color?.join(", ") ?? "-"}
                      </Text>
                    </VStack>
                    <VStack align="flex-end" spacing={0}>
                      <Text fontSize="xs" fontWeight="bold" color="brand.500">
                        ₦{v.price.toLocaleString()}
                      </Text>
                      <Text fontSize="10px" color="textMuted">
                        Stock: {v.stockQuantity}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </SimpleGrid>
            </VStack>
          )}
        </VStack>
      )}

      <Divider borderColor="borderStructural" />

      <HStack justify="space-between">
        <Button variant="ghostOutline" onClick={onBack}>
          Back
        </Button>
        <Button
          bgGradient="var(--brand-gradient)"
          color="white"
          onClick={handlePublish}
          isLoading={updateProductMutation.isPending}>
          Publish Catalog Record
        </Button>
      </HStack>
    </VStack>
  );
}
