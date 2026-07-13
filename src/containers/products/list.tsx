import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@components/shared/data-table";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import {
  getAllProductsQueryOptions,
  getCategoriesQueryOptions,
} from "@services/tanstack-queries/catalog";
import { type ProductsSearchType } from "@utils/schema";
import type { Product } from "@utils/types/response-type";
import { OptionalSelectField } from "@components/forms/select";
import { slugify } from "@utils/misc";

interface ProductListContainerProps {
  searchParams: ProductsSearchType;
}

export function ProductListContainer({
  searchParams,
}: ProductListContainerProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateSearchParam = useUpdateSearchParam<ProductsSearchType>();

  const [searchInput, setSearchInput] = useState(searchParams.search ?? "");

  useEffect(() => {
    setSearchInput(searchParams.search ?? "");
  }, [searchParams.search]);

  const triggerSearch = (val: string) => {
    updateSearchParam("search", val || undefined);
    // updateSearchParam("page", "1");
  };

  const { data: catalogResponse, isLoading } = useQuery(
    getAllProductsQueryOptions(searchParams)
  );
  const { data: categories = [] } = useQuery(getCategoriesQueryOptions());

  const products = catalogResponse?.products ?? [];
  const pagination = catalogResponse?.pagination;

  const onPageChange = (page: number) =>
    updateSearchParam("page", page.toString());

  const onItemsPerPageChange = (limit: number) => {
    updateSearchParam("limit", limit.toString());
    updateSearchParam("page", "1");
  };

  const onPrefetch = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      const nextPage = pagination.currentPage + 1;
      queryClient.prefetchQuery(
        getAllProductsQueryOptions({ ...searchParams, page: String(nextPage) })
      );
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <Box>
          <Text fontSize="sm" fontWeight="600" color="textPrimary">
            {row.original.name}
          </Text>
          {row.original.description && (
            <Text
              fontSize="xs"
              color="textSecondary"
              noOfLines={1}
              maxW="250px">
              {row.original.description}
            </Text>
          )}
        </Box>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <Text fontSize="sm" color="textSecondary">
          {row.original.category?.name ?? "Uncategorized"}
        </Text>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const { minPrice, maxPrice, price } = row.original;
        if (
          minPrice !== undefined &&
          maxPrice !== undefined &&
          minPrice !== maxPrice
        ) {
          return (
            <Text fontSize="sm" fontWeight="600" color="brand.500">
              ₦{minPrice.toLocaleString()} – ₦{maxPrice.toLocaleString()}
            </Text>
          );
        }
        return (
          <Text fontSize="sm" fontWeight="600" color="textPrimary">
            ₦{(price ?? 0).toLocaleString()}
          </Text>
        );
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const hasVariants =
          row.original.variants && row.original.variants.length > 0;
        return (
          <HStack spacing={1}>
            <Text fontSize="sm" fontWeight="600" color="textPrimary">
              {row.original.stockQuantity ?? 0}
            </Text>
            {hasVariants && (
              <Badge
                variant="subtle"
                colorScheme="purple"
                fontSize="9px"
                borderRadius="md">
                variants
              </Badge>
            )}
          </HStack>
        );
      },
    },
    {
      accessorKey: "commissionRate",
      header: "Comm. Rate",
      cell: ({ getValue }) => (
        <Text fontSize="sm" fontWeight="500" color="textPrimary">
          {getValue<number>()}%
        </Text>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<Product["status"]>();
        const colorMap: Record<string, string> = {
          PUBLISHED: "green",
          DRAFT: "yellow",
          SOLD_OUT: "red",
          ARCHIVED: "purple",
        };
        return (
          <Badge
            colorScheme={colorMap[status] ?? "gray"}
            borderRadius="full"
            px="8px"
            py="2px"
            fontSize="10px">
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <VStack align="stretch" spacing={6}>
      <Flex
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={4}
        direction={{ base: "column", md: "row" }}>
        <Box>
          <Heading size="lg">Product Catalog</Heading>
          <Text fontSize="13px" color="textSecondary" mt={1}>
            Manage items, gallery layouts, variations, and financing structures.
          </Text>
        </Box>
        <Button
          leftIcon={<PlusIcon size={16} />}
          as={Link}
          to="/company/products/new">
          Create product
        </Button>
      </Flex>

      <Box
        bg="bgLayer2"
        border="1px solid"
        borderColor="borderStructural"
        borderRadius="2xl"
        overflow="hidden">
        <Flex
          px={5}
          py={4}
          gap={3}
          borderBottom="1px solid"
          borderColor="borderStructural"
          align="center"
          direction={{ base: "column", md: "row" }}>
          <InputGroup maxW={{ md: "300px" }}>
            <InputLeftElement pointerEvents="none" h="40px">
              <MagnifyingGlassIcon size={14} color="#6B7280" />
            </InputLeftElement>
            <Input
              placeholder="Search product name or slug…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerSearch(searchInput);
              }}
              onBlur={() => triggerSearch(searchInput)}
              h="40px"
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
            onChange={(val: any) => {
              const value = val.value !== "" ? val.value : undefined;
              updateSearchParam("category", value);
              // updateSearchParam("page", "1");
            }}
            width="180px"
            height="40px"
          />

          <OptionalSelectField
            options={[
              { value: "", label: "All statuses" },
              ...["DRAFT", "PUBLISHED", "SOLD_OUT", "ARCHIVED"].map((s) => ({
                value: s,
                label: s.charAt(0) + s.slice(1).toLowerCase().replace("_", " "),
              })),
            ]}
            onChange={(val: any) => {
              const value = val.value !== "" ? val.value : undefined;
              updateSearchParam("status", value);
              // updateSearchParam("page", "1");
            }}
            width="150px"
            height="40px"
          />

          <Box flex={1} />
          {pagination && (
            <Text fontSize="12px" color="textMuted">
              Showing {products.length} of {pagination.total} products
            </Text>
          )}
        </Flex>

        <DataTable
          columns={columns}
          data={products}
          fetchLoading={isLoading}
          onRowClick={(row) =>
            navigate({
              to: "/company/products/$productId/$product-name",
              params: {
                productId: row.original.productId,
                "product-name": slugify(row.original.name),
              },
            })
          }
          isInternalPagination
          pagination={{
            currentPage: Number(searchParams.page),
            pageSize: Number(searchParams.limit),
            itemsPerPage: Number(searchParams.limit),
            totalCount: pagination?.total ?? 0,
            onPageChange,
            onItemsPerPageChange,
            onMouseEnter: onPrefetch,
          }}
        />
      </Box>
    </VStack>
  );
}
