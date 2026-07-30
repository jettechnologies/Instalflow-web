import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Heading,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSetVariantImages } from "@services/tanstack-mutations/catalog";
import type { Product, ProductImageDetail } from "@utils/types/response-type";
import { useState } from "react";

interface Step4MediaBindingProps {
  loading?: boolean;
  gallery: ProductImageDetail[];
  product?: Product;
  onNext: () => void;
  onBack: () => void;
}

const pendingKey = (variantId: string, imageId: string) =>
  `${variantId}:${imageId}`;

export function Step4MediaBinding({
  loading,
  gallery,
  product,
  onNext,
  onBack,
}: Step4MediaBindingProps) {
  const { mutateAsync: setVariantImages } = useSetVariantImages();

  const [pendingImages, setPendingImages] = useState<Set<string>>(new Set());
  const variants = product?.variants ?? [];

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="sm">Step 4: Bind Gallery Photos to Variations</Heading>
        <Text fontSize="xs" color="textSecondary" mt={1}>
          Click gallery thumbnails to toggle image assignments for each variant.
        </Text>
      </Box>

      <VStack align="stretch" spacing={4}>
        {loading && (
          <Center
            p={6}
            textAlign="center"
            bg="bgLayer1"
            borderRadius="xl"
            border="1px solid"
            borderColor="borderStructural">
            <Spinner size="md" color="brand.500" thickness="3px" />
          </Center>
        )}

        {variants.map((v) => {
          const currentImageIds: string[] =
            (v.images?.map((img) => img.imageId) as string[]) ?? [];

          const toggle = async (imageId: string) => {
            const next = currentImageIds.includes(imageId)
              ? currentImageIds.filter((id) => id !== imageId)
              : [...currentImageIds, imageId];

            const key = pendingKey(v.variantId, imageId);

            setPendingImages((prev) => new Set(prev).add(key));

            try {
              await setVariantImages({
                variantId: v.variantId,
                imageIds: next,
              });
            } finally {
              setPendingImages((prev) => {
                const updated = new Set(prev);
                updated.delete(key);
                return updated;
              });
            }
          };

          return (
            <Box
              key={v.variantId}
              p={4}
              bg="bgLayer1"
              borderRadius="xl"
              border="1px solid"
              borderColor="borderStructural">
              <HStack justify="space-between" mb={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold">
                    {v.sku}
                  </Text>
                  <Text fontSize="10px" color="textSecondary">
                    Price: ₦{v.price.toLocaleString()} | Size: {v.size ?? "-"}
                  </Text>
                </Box>
                <Badge colorScheme="purple">
                  {currentImageIds.length} images
                </Badge>
              </HStack>

              <HStack spacing={3} flexWrap="wrap">
                {gallery.map((img) => {
                  const active = img.variants?.some(
                    (v) => v.variantId === v.variantId
                  );
                  const isPending = pendingImages.has(
                    pendingKey(v.variantId, img.imageId)
                  );

                  return (
                    <Box
                      key={img.imageId}
                      position="relative"
                      border="2px solid"
                      borderColor={
                        active ? "var(--brand-primary)" : "transparent"
                      }
                      borderRadius="lg"
                      overflow="hidden"
                      cursor={isPending ? "default" : "pointer"}
                      pointerEvents={isPending ? "none" : "auto"}
                      onClick={() => toggle(img.imageId)}
                      transition="border-color 0.15s ease">
                      <Image
                        src={img.imageUrl}
                        w="60px"
                        h="60px"
                        objectFit="cover"
                      />

                      {isPending && (
                        <Box
                          position="absolute"
                          inset={0}
                          bg="blackAlpha.700"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          zIndex={1}>
                          <Spinner size="sm" color="white" thickness="3px" />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </HStack>
            </Box>
          );
        })}

        {variants.length === 0 && (
          <Box
            p={6}
            textAlign="center"
            bg="bgLayer1"
            borderRadius="xl"
            border="1px solid"
            borderColor="borderStructural">
            <Text fontSize="sm" color="textMuted">
              No variations added yet — go back to Step 3 to create variants
              first.
            </Text>
          </Box>
        )}
      </VStack>

      <Divider borderColor="borderStructural" />

      <HStack justify="space-between">
        <Button variant="ghostOutline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next: Review Details</Button>
      </HStack>
    </VStack>
  );
}
