import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Badge,
  Button,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import {
  getCategoriesQueryOptions,
  getProductDetailsQueryOptions,
  getProductGalleryQueryOptions,
} from "@services/tanstack-queries/catalog";
import {
  useArchiveProduct,
  useUpdateProduct,
} from "@services/tanstack-mutations/catalog";

import { ProductMetaCard } from "@components/products/product-meta-card";
import { ProductPricingCard } from "@components/products/product-pricing-card";
import { ProductVariantsTable } from "@components/tables/products/product-variants-table";
import { ProductGallerySidebar } from "@components/products/product-gallery-sidebar";
import { ProductPlansSidebar } from "@components/products/product-plans-sidebar";
import { CreateVariantModal } from "@layouts/modal-layout/create-variant-modal";
import {
  EditVariantModal,
  type VariantForEdit,
} from "@layouts/modal-layout/edit-variant-modal";
import { CreatePlanModal } from "@layouts/modal-layout/create-plan-modal";

interface ProductDetailsContainerProps {
  productId: string;
}

export function ProductDetailsContainer({
  productId,
}: ProductDetailsContainerProps) {
  const navigate = useNavigate();

  const { data: product } = useQuery(getProductDetailsQueryOptions(productId));
  const { data: gallery = [] } = useQuery(
    getProductGalleryQueryOptions(productId)
  );
  const { data: categories = [] } = useQuery(getCategoriesQueryOptions());

  const updateProductMutation = useUpdateProduct(productId);
  const archiveMutation = useArchiveProduct(productId);

  const {
    isOpen: isVariantOpen,
    onOpen: onVariantOpen,
    onClose: onVariantClose,
  } = useDisclosure();
  const {
    isOpen: isEditVariantOpen,
    onOpen: onEditVariantOpen,
    onClose: onEditVariantClose,
  } = useDisclosure();
  const {
    isOpen: isPlanOpen,
    onOpen: onPlanOpen,
    onClose: onPlanClose,
  } = useDisclosure();

  const [selectedVariant, setSelectedVariant] = useState<VariantForEdit | null>(
    null
  );

  const handleEditVariant = (variant: any) => {
    setSelectedVariant(variant);
    onEditVariantOpen();
  };

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync();
      navigate({ to: "/company/products" });
    } catch (_) {}
  };

  if (!product)
    return <Text color="textSecondary">Resolving product workspace…</Text>;

  return (
    <VStack align="stretch" spacing={6} pb={12}>
      {/* Header row */}
      <HStack justify="space-between" flexWrap="wrap" gap={3}>
        <HStack spacing={3}>
          <IconButton
            aria-label="Back to catalog"
            icon={<ArrowLeftIcon size={16} />}
            as={Link}
            to="/company/products"
            variant="ghost"
          />
          <Heading size="lg">{product.name}</Heading>
          <Badge
            colorScheme={
              product.status === "PUBLISHED"
                ? "green"
                : product.status === "DRAFT"
                  ? "yellow"
                  : "red"
            }>
            {product.status}
          </Badge>
        </HStack>

        <HStack spacing={3}>
          {(product.status === "DRAFT" || product.status === "ARCHIVED") && (
            <Button
              size="sm"
              bgGradient="var(--brand-gradient)"
              color="white"
              onClick={() =>
                updateProductMutation.mutateAsync({ status: "PUBLISHED" })
              }>
              Publish Catalog Item
            </Button>
          )}
          {product.status === "PUBLISHED" && (
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={handleArchive}>
              Archive Product
            </Button>
          )}
        </HStack>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        <VStack align="stretch" spacing={6} gridColumn={{ lg: "span 2" }}>
          <ProductMetaCard product={product} categories={categories} />
          <ProductPricingCard product={product} />
          <ProductVariantsTable
            product={product}
            onAddVariant={onVariantOpen}
            onEditVariant={handleEditVariant}
          />
        </VStack>

        <VStack align="stretch" spacing={6}>
          <ProductGallerySidebar productId={productId} gallery={gallery} />
          <ProductPlansSidebar product={product} onAddPlan={onPlanOpen} />
        </VStack>
      </SimpleGrid>

      <CreateVariantModal
        productId={productId}
        isOpen={isVariantOpen}
        onClose={onVariantClose}
      />
      <EditVariantModal
        productId={productId}
        variant={selectedVariant}
        isOpen={isEditVariantOpen}
        onClose={onEditVariantClose}
      />
      <CreatePlanModal
        productId={productId}
        isOpen={isPlanOpen}
        onClose={onPlanClose}
      />
    </VStack>
  );
}
