import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {
  SquaresFourIcon,
  ListIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBulkCreateVariants,
  useCreateVariant,
} from "@services/tanstack-mutations/catalog";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
import type { Product, ProductImage } from "@utils/types/response-type";

interface Step3VariantsProps {
  productId: string;
  gallery: ProductImage[];
  product?: Product;
  onNext: () => void;
  onBack: () => void;
}

interface BulkRow {
  sku: string;
  price: string;
  stockQuantity: string;
  size: string;
  color: string;
  imageIds: string[];
}

export function Step3Variants({
  productId,
  gallery,
  product,
  onNext,
  onBack,
}: Step3VariantsProps) {
  const queryClient = useQueryClient();
  const [entryMode, setEntryMode] = useState<"single" | "bulk">("single");

  const bulkCreateMutation = useBulkCreateVariants(productId);
  const createVariantMutation = useCreateVariant(productId);

  const [single, setSingle] = useState({
    sku: "",
    price: "",
    stockQuantity: "",
    size: "",
    color: "",
    imageIds: [] as string[],
  });

  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    {
      sku: "",
      price: "",
      stockQuantity: "",
      size: "",
      color: "",
      imageIds: [],
    },
  ]);

  const [skuErrors, setSkuErrors] = useState<Record<string, string>>({});

  const checkSku = (sku: string, key: string) => {
    if (!sku.trim()) return;
    const exists = product?.variants?.some(
      (v) => v.sku.toLowerCase() === sku.trim().toLowerCase()
    );
    if (exists) {
      setSkuErrors((prev) => ({
        ...prev,
        [key]: "SKU already registered in catalog",
      }));
    } else {
      setSkuErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const invalidateCatalog = () =>
    queryClient.invalidateQueries(
      getProductDetailsQueryOptions(productId) as any
    );

  const handleAddSingle = async () => {
    if (
      skuErrors.single ||
      !single.sku ||
      !single.price ||
      !single.stockQuantity
    )
      return;
    try {
      await createVariantMutation.mutateAsync({
        sku: single.sku,
        price: parseFloat(single.price),
        stockQuantity: parseInt(single.stockQuantity),
        size: single.size,
        color: single.color ? [single.color] : [],
        imageIds: single.imageIds.map(Number),
        isActive: true,
      });
      setSingle({
        sku: "",
        price: "",
        stockQuantity: "",
        size: "",
        color: "",
        imageIds: [],
      });
      invalidateCatalog();
    } catch (_) {}
  };

  const handleAddBulk = async () => {
    const validRows = bulkRows.filter(
      (r) => r.sku && r.price && r.stockQuantity
    );
    if (!validRows.length) return;
    try {
      await bulkCreateMutation.mutateAsync(
        validRows.map((r) => ({
          sku: r.sku,
          price: parseFloat(r.price),
          stockQuantity: parseInt(r.stockQuantity),
          size: r.size,
          color: r.color ? [r.color] : [],
          imageIds: r.imageIds.map(Number),
        }))
      );
      setBulkRows([
        {
          sku: "",
          price: "",
          stockQuantity: "",
          size: "",
          color: "",
          imageIds: [],
        },
      ]);
      invalidateCatalog();
    } catch (_) {}
  };

  const updateBulkRow = (index: number, key: keyof BulkRow, val: any) =>
    setBulkRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [key]: val } : row))
    );

  const toggleGalleryImage = (
    imageId: string,
    currentIds: string[],
    setter: (fn: any) => void
  ) => {
    const next = currentIds.includes(imageId)
      ? currentIds.filter((id) => id !== imageId)
      : [...currentIds, imageId];
    setter(next);
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header + mode toggle */}
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="sm">Step 3: Variations Catalog Setup</Heading>
          <Text fontSize="xs" color="textSecondary" mt={1}>
            Specify price, SKU, inventory, size, color, and linked photos.
          </Text>
        </Box>
        <HStack bg="bgLayer1" p={1} borderRadius="xl">
          <IconButton
            aria-label="Single entry mode"
            icon={<ListIcon size={16} />}
            size="sm"
            variant={entryMode === "single" ? "solid" : "ghost"}
            onClick={() => setEntryMode("single")}
          />
          <IconButton
            aria-label="Bulk spreadsheet mode"
            icon={<SquaresFourIcon size={16} />}
            size="sm"
            variant={entryMode === "bulk" ? "solid" : "ghost"}
            onClick={() => setEntryMode("bulk")}
          />
        </HStack>
      </Flex>

      {/* Existing variants summary */}
      {product?.variants && product.variants.length > 0 && (
        <Box
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="xl"
          p={4}
          bg="bgLayer1">
          <Text fontSize="xs" fontWeight="bold" color="textSecondary" mb={3}>
            Added Variations ({product.variants.length}):
          </Text>
          <VStack align="stretch" spacing={2}>
            {product.variants.map((v) => (
              <HStack
                key={v.variantId}
                p={2}
                bg="bgLayer2"
                borderRadius="lg"
                justify="space-between"
                border="1px solid"
                borderColor="borderStructural">
                <Box>
                  <Text fontSize="xs" fontWeight="bold">
                    {v.sku}
                  </Text>
                  <Text fontSize="10px" color="textSecondary">
                    Size: {v.size ?? "-"} | Color: {v.color?.join(", ") ?? "-"}
                  </Text>
                </Box>
                <HStack spacing={4}>
                  <Text fontSize="xs" fontWeight="bold" color="brand.500">
                    ₦{v.price.toLocaleString()}
                  </Text>
                  <Badge colorScheme="purple">{v.stockQuantity} units</Badge>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      {entryMode === "single" && (
        <VStack
          spacing={4}
          align="stretch"
          bg="bgLayer1"
          p={4}
          borderRadius="xl"
          border="1px solid"
          borderColor="borderStructural">
          <Text fontSize="xs" fontWeight="bold">
            Create Single Variant:
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl isInvalid={!!skuErrors.single}>
              <FormLabel fontSize="xs" color="textSecondary">
                SKU Code
              </FormLabel>
              <Input
                value={single.sku}
                placeholder="e.g. IPHONE-BLK-256"
                onChange={(e) =>
                  setSingle((p) => ({ ...p, sku: e.target.value }))
                }
                onBlur={() => checkSku(single.sku, "single")}
              />
              {skuErrors.single && (
                <Text fontSize="10px" color="statusDanger">
                  {skuErrors.single}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" color="textSecondary">
                Price (₦)
              </FormLabel>
              <Input
                type="number"
                value={single.price}
                placeholder="0.00"
                onChange={(e) =>
                  setSingle((p) => ({ ...p, price: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" color="textSecondary">
                Stock Quantity
              </FormLabel>
              <Input
                type="number"
                value={single.stockQuantity}
                placeholder="10"
                onChange={(e) =>
                  setSingle((p) => ({ ...p, stockQuantity: e.target.value }))
                }
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="xs" color="textSecondary">
                Size / Storage
              </FormLabel>
              <Input
                value={single.size}
                placeholder="e.g. 256GB, Large"
                onChange={(e) =>
                  setSingle((p) => ({ ...p, size: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" color="textSecondary">
                Color
              </FormLabel>
              <Input
                value={single.color}
                placeholder="e.g. Black Titanium"
                onChange={(e) =>
                  setSingle((p) => ({ ...p, color: e.target.value }))
                }
              />
            </FormControl>
          </SimpleGrid>

          {gallery.length > 0 && (
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xs" fontWeight="600" color="textSecondary">
                Associate Gallery Images:
              </Text>
              <HStack spacing={3} flexWrap="wrap">
                {gallery.map((img) => {
                  const selected = single.imageIds.includes(img.imageId);
                  return (
                    <Box
                      key={img.imageId}
                      border="2px solid"
                      borderColor={selected ? "brand.500" : "transparent"}
                      borderRadius="lg"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() =>
                        toggleGalleryImage(
                          img.imageId,
                          single.imageIds,
                          (next: string[]) =>
                            setSingle((p) => ({ ...p, imageIds: next }))
                        )
                      }>
                      <Image
                        src={img.imageUrl}
                        w="50px"
                        h="50px"
                        objectFit="cover"
                      />
                    </Box>
                  );
                })}
              </HStack>
            </VStack>
          )}

          <Button
            size="sm"
            alignSelf="flex-end"
            leftIcon={<PlusIcon size={14} />}
            onClick={handleAddSingle}
            isLoading={createVariantMutation.isPending}
            isDisabled={!single.sku || !single.price || !single.stockQuantity}>
            Add Variant
          </Button>
        </VStack>
      )}

      {entryMode === "bulk" && (
        <VStack
          spacing={4}
          align="stretch"
          bg="bgLayer1"
          p={4}
          borderRadius="xl"
          border="1px solid"
          borderColor="borderStructural">
          <Text fontSize="xs" fontWeight="bold">
            Variations Spreadsheet:
          </Text>
          <VStack align="stretch" spacing={3}>
            {bulkRows.map((row, index) => (
              <Box
                key={index}
                p={3}
                bg="bgLayer2"
                borderRadius="xl"
                border="1px solid"
                borderColor="borderStructural">
                <SimpleGrid columns={{ base: 1, md: 5 }} spacing={3}>
                  <FormControl isInvalid={!!skuErrors[`row-${index}`]}>
                    <FormLabel fontSize="10px">SKU</FormLabel>
                    <Input
                      size="sm"
                      value={row.sku}
                      placeholder="SKU"
                      onChange={(e) =>
                        updateBulkRow(index, "sku", e.target.value)
                      }
                      onBlur={() => checkSku(row.sku, `row-${index}`)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="10px">Price</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      value={row.price}
                      placeholder="0.00"
                      onChange={(e) =>
                        updateBulkRow(index, "price", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="10px">Stock</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      value={row.stockQuantity}
                      placeholder="Stock"
                      onChange={(e) =>
                        updateBulkRow(index, "stockQuantity", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="10px">Size</FormLabel>
                    <Input
                      size="sm"
                      value={row.size}
                      placeholder="e.g. 256GB"
                      onChange={(e) =>
                        updateBulkRow(index, "size", e.target.value)
                      }
                    />
                  </FormControl>
                  <HStack align="flex-end">
                    <FormControl>
                      <FormLabel fontSize="10px">Color</FormLabel>
                      <Input
                        size="sm"
                        value={row.color}
                        placeholder="e.g. Black"
                        onChange={(e) =>
                          updateBulkRow(index, "color", e.target.value)
                        }
                      />
                    </FormControl>
                    <IconButton
                      aria-label="Remove row"
                      icon={<TrashIcon size={12} />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() =>
                        setBulkRows((prev) =>
                          prev.filter((_, idx) => idx !== index)
                        )
                      }
                      isDisabled={bulkRows.length <= 1}
                    />
                  </HStack>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>

          <HStack justify="space-between">
            <Button
              size="xs"
              leftIcon={<PlusIcon size={12} color="#ffffff" />}
              color="#ffffff"
              bg="#242636"
              _hover={{
                bg: "#242636",
                borderColor: "#5c5f7b",
              }}
              onClick={() =>
                setBulkRows((prev) => [
                  ...prev,
                  {
                    sku: "",
                    price: "",
                    stockQuantity: "",
                    size: "",
                    color: "",
                    imageIds: [],
                  },
                ])
              }>
              Add Row
            </Button>
            <Button
              size="sm"
              onClick={handleAddBulk}
              isLoading={bulkCreateMutation.isPending}
              loadingText="Submitting...">
              Submit Bulk Rows
            </Button>
          </HStack>
        </VStack>
      )}

      <Divider borderColor="borderStructural" />

      <HStack justify="space-between">
        <Button variant="ghostOutline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next Step</Button>
      </HStack>
    </VStack>
  );
}
