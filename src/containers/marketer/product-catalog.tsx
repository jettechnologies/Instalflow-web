import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { getMarketerProductsQueryOptions } from "@services/tanstack-queries/marketer";
import { GenerateLinkModal } from "@layouts/modal-layout/generate-link-modal";
import { slugify } from "@utils/misc";
import type { Product } from "@utils/types/response-type";
import { getCategoriesQueryOptions } from "@services/tanstack-queries/catalog";
import { OptionalSelectField } from "@components/forms/select";
import type { MarketersProductSearchType } from "@utils/schema";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { LinkSimpleIcon } from "@phosphor-icons/react";
import { ProductCard } from "@components/marketer/products";

interface MarketerProductCatalogProps {
  searchParams: MarketersProductSearchType;
}

export function MarketerProductCatalog({
  searchParams,
}: MarketerProductCatalogProps) {
  const navigate = useNavigate();
  const modal = useDisclosure();
  const [active, setActive] = useState<Product | null>(null);

  const { category, search } = searchParams;

  const { data: products, isLoading } = useQuery({
    ...getMarketerProductsQueryOptions(searchParams),
    select: (data) =>
      data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  });

  const { data: categories = [] } = useQuery(getCategoriesQueryOptions());

  const updateSearchParam = useUpdateSearchParam<MarketersProductSearchType>();

  const openLinkFor = (p: Product) => {
    setActive(p);
    modal.onOpen();
  };

  const goToDetails = (p: Product) =>
    navigate({
      to: "/marketer/products/$productId/$product-name",
      params: {
        productId: p.productId,
        "product-name": slugify(p.name),
      },
    });

  return (
    <AppShell
      title="Product catalog"
      subtitle="Select a product to generate your referral link.">
      <Flex
        gap={3}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}>
        <InputGroup maxW={{ md: "320px" }}>
          <InputLeftElement pointerEvents="none">
            <Search size={14} color="#667185" />
          </InputLeftElement>
          <Input
            placeholder="Search products or SKU…"
            value={search}
            onChange={(e) => updateSearchParam("search", e.target.value)}
          />
        </InputGroup>
        <OptionalSelectField
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({
              value: c.slug,
              label: c.name,
            })),
          ]}
          defaultValue={category ?? ""}
          onChange={(val: any) => {
            const value = val.value !== "" ? val.value : undefined;
            updateSearchParam("category", value);
          }}
          width="180px"
          height="40px"
        />
        <Box flex={1} />
        <Text fontSize="12px" color="textMuted">
          {products?.length} of {products?.length ?? 0} items
        </Text>
      </Flex>
      {isLoading ? (
        <Flex justify="center" py={20}>
          <Spinner color="brand.400" />
        </Flex>
      ) : products?.length === 0 ? (
        <Box
          bg="bgLayer2"
          border="1px dashed"
          borderColor="borderStructural"
          borderRadius="2xl"
          py={16}
          textAlign="center">
          <VStack spacing={2}>
            <LinkSimpleIcon size={26} color="#475467" />
            <Text fontSize="13px" color="textSecondary">
              No products match your filters.
            </Text>
          </VStack>
        </Box>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, xl: 4, "2xl": 5 }}
          spacing={4}>
          {products?.map((p) => (
            <ProductCard
              key={p.productId}
              product={p}
              onGetLink={() => openLinkFor(p)}
              onViewDetails={() => goToDetails(p)}
            />
          ))}
        </SimpleGrid>
      )}
      q456io
      <GenerateLinkModal
        product={active}
        isOpen={modal.isOpen}
        onClose={() => {
          modal.onClose();
          setActive(null);
        }}
      />
    </AppShell>
  );
}
