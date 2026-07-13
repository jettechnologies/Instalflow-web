import { useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TrashIcon, UploadIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRemoveGalleryImage,
  useReorderGalleryImages,
  useSetPrimaryImage,
  useUploadGalleryImages,
} from "@services/tanstack-mutations/catalog";
import { getProductGalleryQueryOptions } from "@services/tanstack-queries/catalog";
import type { ProductImage } from "@utils/types/response-type";

interface ProductGallerySidebarProps {
  productId: string;
  gallery: ProductImage[];
}

export function ProductGallerySidebar({
  productId,
  gallery,
}: ProductGallerySidebarProps) {
  const queryClient = useQueryClient();
  const uploadMutation = useUploadGalleryImages(productId);
  const reorderMutation = useReorderGalleryImages(productId);
  const setPrimaryMutation = useSetPrimaryImage(productId);
  const deleteMutation = useRemoveGalleryImage(productId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries(
      getProductGalleryQueryOptions(productId) as any
    );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) =>
      formData.append("images", file)
    );
    formData.append(
      "altTextMap",
      JSON.stringify({ "0": "Product Gallery Image" })
    );
    try {
      await uploadMutation.mutateAsync(formData);
      invalidate();
    } catch (_) {}
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...gallery];
    const [moved] = list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderMutation.mutateAsync(list.map((img) => img.imageId));
    } catch (_) {}
    setDraggedIndex(null);
  };

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={5}>
      <Heading size="xs" mb={3}>
        Product Gallery Layout
      </Heading>

      {/* Upload trigger */}
      <Flex
        w="full"
        h="80px"
        border="2px dashed"
        borderColor="borderStructural"
        bg="bgLayer1"
        align="center"
        justify="center"
        cursor="pointer"
        borderRadius="xl"
        onClick={() => fileInputRef.current?.click()}
        mb={4}
        _hover={{ borderColor: "brand.500" }}
        transition="border-color 0.15s ease">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <HStack spacing={2}>
          <UploadIcon size={16} />
          <Text fontSize="xs">Upload Gallery Files</Text>
        </HStack>
      </Flex>

      {/* Draggable gallery list */}
      <VStack align="stretch" spacing={3}>
        {gallery.map((img, index) => (
          <HStack
            key={img.imageId}
            p={2}
            bg="bgLayer1"
            borderRadius="xl"
            border="1px solid"
            borderColor="borderStructural"
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            cursor="grab">
            <Image
              src={img.imageUrl}
              w="40px"
              h="40px"
              objectFit="cover"
              borderRadius="md"
            />
            <Box flex={1}>
              <Text fontSize="10px" color="textSecondary" noOfLines={1}>
                {img.altText ?? `Image #${img.imageId}`}
              </Text>
              {img.isPrimary && (
                <Badge colorScheme="green" fontSize="8px">
                  PRIMARY
                </Badge>
              )}
            </Box>
            <HStack spacing={1}>
              {!img.isPrimary && (
                <Button
                  size="xs"
                  variant="ghost"
                  fontSize="9px"
                  onClick={() => setPrimaryMutation.mutate(img.imageId)}>
                  Set Primary
                </Button>
              )}
              <IconButton
                aria-label="Delete image"
                icon={<TrashIcon size={12} />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => deleteMutation.mutate(img.imageId)}
              />
            </HStack>
          </HStack>
        ))}

        {gallery.length === 0 && (
          <Text fontSize="xs" color="textMuted" textAlign="center" py={4}>
            No gallery images uploaded yet.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
