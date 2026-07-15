import { useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowClockwiseIcon,
  TrashIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import {
  useRemoveGalleryImage,
  useReorderGalleryImages,
  useSetPrimaryImage,
  useUploadGalleryImages,
} from "@services/tanstack-mutations/catalog";
import type { ProductImage } from "@utils/types/response-type";

interface UploadEntry {
  id: string;
  name: string;
  file: File;
  progress: number;
  failed: boolean;
}

interface Step2GalleryProps {
  productId: string;
  gallery: ProductImage[];
  onNext: () => void;
  onBack: () => void;
}

export function Step2Gallery({
  productId,
  gallery,
  onNext,
  onBack,
}: Step2GalleryProps) {
  const uploadMutation = useUploadGalleryImages(productId);
  const deleteMutation = useRemoveGalleryImage(productId);
  const reorderMutation = useReorderGalleryImages(productId);
  const primaryMutation = useSetPrimaryImage(productId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const runUpload = async (uid: string, file: File) => {
    const formData = new FormData();
    formData.append("images", file);
    formData.append(
      "altTextMap",
      JSON.stringify({ "0": file.name.split(".")[0] })
    );

    const timer = setInterval(() => {
      setUploads((prev) =>
        prev.map((up) =>
          up.id === uid
            ? { ...up, progress: Math.min(up.progress + 20, 90) }
            : up
        )
      );
    }, 300);

    try {
      await uploadMutation.mutateAsync(formData);
      clearInterval(timer);
      setUploads((prev) => prev.filter((up) => up.id !== uid));
    } catch (_) {
      clearInterval(timer);
      setUploads((prev) =>
        prev.map((up) =>
          up.id === uid ? { ...up, failed: true, progress: 100 } : up
        )
      );
    }
  };

  const uploadFile = async (file: File) => {
    const uid = Math.random().toString(36).substring(7);
    setUploads((prev) => [
      ...prev,
      { id: uid, file, name: file.name, progress: 10, failed: false },
    ]);
    await runUpload(uid, file);
  };

  const retryUpload = async (uid: string) => {
    const entry = uploads.find((up) => up.id === uid);
    if (!entry) return;

    setUploads((prev) =>
      prev.map((up) =>
        up.id === uid ? { ...up, failed: false, progress: 10 } : up
      )
    );
    await runUpload(uid, entry.file);
  };

  const dismissUpload = (uid: string) => {
    setUploads((prev) => prev.filter((up) => up.id !== uid));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(uploadFile);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDropItem = async (e: React.DragEvent, targetIndex: number) => {
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
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="sm">Step 2: Upload Gallery Images</Heading>
        <Text fontSize="xs" color="textSecondary" mt={1}>
          Drop product images below. Uploads happen immediately. The first photo
          is auto-marked as Primary.
        </Text>
      </Box>

      {/* Dropzone */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        border="2px dashed"
        borderColor={dragActive ? "brand.500" : "borderStructural"}
        bg={dragActive ? "whiteAlpha.50" : "bgLayer1"}
        p={8}
        borderRadius="2xl"
        cursor="pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        transition="all 0.15s ease">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <UploadIcon size={32} color="var(--chakra-colors-textSecondary)" />
        <Text fontSize="sm" mt={3} fontWeight="600">
          Drag &amp; Drop files here or click to upload
        </Text>
        <Text fontSize="xs" color="textMuted" mt={1}>
          Supports JPEG, PNG, WebP up to 5 MB
        </Text>
      </Flex>

      {/* Per-file upload progress list */}
      {uploads.length > 0 && (
        <VStack align="stretch" spacing={2}>
          <Text fontSize="xs" fontWeight="600" color="textSecondary">
            Uploading Assets:
          </Text>
          {uploads.map((up) => (
            <HStack
              key={up.id}
              spacing={4}
              bg="bgLayer1"
              p={3}
              borderRadius="xl"
              border="1px solid"
              borderColor="borderStructural">
              <Text fontSize="xs" noOfLines={1} flex={1}>
                {up.name}
              </Text>
              {up.failed ? (
                // <Text fontSize="xs" color="statusDanger">
                //   Failed — retry
                // </Text>
                <HStack spacing={2}>
                  <Text fontSize="xs" color="statusDanger">
                    Failed
                  </Text>
                  <IconButton
                    aria-label="Retry upload"
                    icon={<ArrowClockwiseIcon size={12} />}
                    size="xs"
                    variant="ghost"
                    colorScheme="purple"
                    isLoading={uploadMutation.isPending}
                    onClick={() => retryUpload(up.id)}
                  />
                  <IconButton
                    aria-label="Dismiss failed upload"
                    icon={<TrashIcon size={12} />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => dismissUpload(up.id)}
                  />
                </HStack>
              ) : (
                <Progress
                  value={up.progress}
                  size="xs"
                  colorScheme="purple"
                  w="80px"
                  borderRadius="full"
                />
              )}
            </HStack>
          ))}
        </VStack>
      )}

      {/* Gallery grid — draggable to reorder */}
      {gallery.length > 0 && (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="xs" fontWeight="600" color="textSecondary">
            Current Gallery Layout (drag items to reorder):
          </Text>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={4}>
            {gallery.map((img, index) => (
              <Box
                key={img.imageId}
                bg="bgLayer1"
                border="1px solid"
                borderColor="borderStructural"
                borderRadius="xl"
                overflow="hidden"
                position="relative"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropItem(e, index)}
                cursor="grab"
                _active={{ cursor: "grabbing" }}
                transition="opacity 0.2s">
                <Image
                  src={img.imageUrl}
                  alt={img.altText ?? "Product photo"}
                  h="120px"
                  w="full"
                  objectFit="cover"
                />
                {img.isPrimary && (
                  <Badge
                    colorScheme="green"
                    position="absolute"
                    top={2}
                    left={2}
                    fontSize="9px">
                    Primary
                  </Badge>
                )}
                <Flex
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="blackAlpha.800"
                  p={1}
                  justify="space-between"
                  align="center">
                  {!img.isPrimary ? (
                    <Button
                      size="xs"
                      variant="link"
                      color="textSecondary"
                      fontSize="10px"
                      onClick={() => primaryMutation.mutate(img.imageId)}>
                      Make Primary
                    </Button>
                  ) : (
                    <Box />
                  )}
                  <IconButton
                    aria-label="Remove image"
                    icon={<TrashIcon size={12} />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => deleteMutation.mutate(img.imageId)}
                  />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      )}

      <Divider borderColor="borderStructural" />

      <HStack justify="space-between">
        <Button variant="ghostOutline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next: Product Variations</Button>
      </HStack>
    </VStack>
  );
}
