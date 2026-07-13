import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";
import DataTable from "@components/shared/data-table";
import {
  useToggleVariantStatus,
  useUpdateVariantStock,
} from "@services/tanstack-mutations/catalog";
import type { Product } from "@utils/types/response-type";
import { useToastContext } from "@hooks/context";

type ProductVariant = NonNullable<Product["variants"]>[number];

const STATUS_META = {
  active: { label: "Active", bg: "green.100", color: "green.600" },
  inactive: { label: "Disabled", bg: "gray.100", color: "gray.600" },
} as const;

interface GetColumnsOpts {
  onStockBlur: (variant: ProductVariant, stock: number) => void;
  pendingStockId: string | null;
}

export const getProductVariantsColumns = ({
  onStockBlur,
  pendingStockId,
}: GetColumnsOpts): ColumnDef<ProductVariant>[] => [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <Text fontWeight="bold" fontSize="xs">
        {row.original.sku}
      </Text>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <Text fontSize="xs" color="textSecondary">
        {row.original.size ?? "-"}
      </Text>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <Text fontSize="xs" color="textSecondary">
        {row.original.color?.join(", ") ?? "-"}
      </Text>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <Text fontWeight="600" fontSize="xs">
        ₦{row.original.price.toLocaleString()}
      </Text>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    cell: ({ row }) => {
      const v = row.original;
      const isPending = pendingStockId === v.variantId;
      return (
        <Input
          size="xs"
          w="60px"
          type="number"
          isDisabled={isPending}
          defaultValue={v.stockQuantity}
          key={v.stockQuantity} // resync if a refetch changes the server value
          onBlur={(e) => {
            const stock = parseInt(e.target.value, 10);
            if (!Number.isNaN(stock) && stock !== v.stockQuantity) {
              onStockBlur(v, stock);
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const meta = row.original.isActive
        ? STATUS_META.active
        : STATUS_META.inactive;
      return (
        <Badge
          bg={meta.bg}
          color={meta.color}
          borderRadius="full"
          px="8px"
          py="2px"
          fontSize="xs">
          {meta.label}
        </Badge>
      );
    },
  },
];

interface ProductVariantsTableProps {
  product: Product;
  isLoading?: boolean;
  onAddVariant: () => void;
  onEditVariant: (variant: ProductVariant) => void;
}

export function ProductVariantsTable({
  product,
  isLoading,
  onAddVariant,
  onEditVariant,
}: ProductVariantsTableProps) {
  const { openToast } = useToastContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pendingStockId, setPendingStockId] = useState<string | null>(null);

  const updateStockMutation = useUpdateVariantStock(product.productId);
  const toggleVariantMutation = useToggleVariantStatus(product.productId);

  const handleStockBlur = async (variant: ProductVariant, stock: number) => {
    setPendingStockId(variant.variantId);
    try {
      await updateStockMutation.mutateAsync({
        variantId: variant.variantId,
        stockQuantity: stock,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ?? err?.message;

      openToast(errorMessage, "error");
    } finally {
      setPendingStockId(null);
    }
  };

  const handleToggleStatus = async (variant: ProductVariant) => {
    try {
      await toggleVariantMutation.mutateAsync({
        variantId: variant.variantId,
        isActive: !variant.isActive,
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.message ??
        "This variant may have active financing contracts attached.";

      openToast(errorMessage, "error");
    }
  };

  const columns = useMemo(
    () =>
      getProductVariantsColumns({
        onStockBlur: handleStockBlur,
        pendingStockId,
      }),
    [pendingStockId, product.productId]
  );

  const variants = product.variants ?? [];

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="sm">Product Variations</Heading>
        <Button size="sm" onClick={onAddVariant}>
          Add Variant
        </Button>
      </Flex>

      <DataTable<ProductVariant>
        data={variants}
        columns={columns}
        fetchLoading={isLoading}
        getRowId={(row) => row.variantId}
        isInternalPagination
        tableAction={{
          actions: [
            {
              label: "Edit Variant",
              onClick: (row) => onEditVariant(row.original),
            },
            {
              label: "Toggle Status",
              onClick: (row) => handleToggleStatus(row.original),
            },
          ],
        }}
        pagination={{
          currentPage: page,
          itemsPerPage: limit,
          pageSize: limit,
          totalCount: variants.length,
          onPageChange: setPage,
          onItemsPerPageChange: setLimit,
        }}
      />
    </Box>
  );
}

// // ─────────────────────────────────────────────────────────────────────────────
// // Product Variants Table — inline stock edit, status toggle, edit action
// // ─────────────────────────────────────────────────────────────────────────────
// import {
//   Box,
//   Button,
//   Flex,
//   Heading,
//   IconButton,
//   Input,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import { PencilSimpleIcon } from "@phosphor-icons/react";
// import { useQueryClient } from "@tanstack/react-query";
// import {
//   useToggleVariantStatus,
//   useUpdateVariantStock,
// } from "@services/tanstack-mutations/catalog";
// import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
// import type { Product } from "@utils/types/response-type";

// interface ProductVariantsTableProps {
//   product: Product;
//   onAddVariant: () => void;
//   onEditVariant: (variant: any) => void;
// }

// export function ProductVariantsTable({
//   product,
//   onAddVariant,
//   onEditVariant,
// }: ProductVariantsTableProps) {
//   const queryClient = useQueryClient();
//   const updateStockMutation = useUpdateVariantStock(product.productId, "");
//   const toggleVariantMutation = useToggleVariantStatus(product.productId, "");

//   const invalidate = () =>
//     queryClient.invalidateQueries(
//       getProductDetailsQueryOptions(product.productId) as any
//     );

//   return (
//     <Box
//       bg="bgLayer2"
//       border="1px solid"
//       borderColor="borderStructural"
//       borderRadius="2xl"
//       p={6}>
//       <Flex justify="space-between" align="center" mb={4}>
//         <Heading size="sm">Product Variations</Heading>
//         <Button size="sm" onClick={onAddVariant}>
//           Add Variant
//         </Button>
//       </Flex>

//       <Table variant="simple" size="sm">
//         <Thead>
//           <Tr>
//             <Th color="textMuted">SKU</Th>
//             <Th color="textMuted">Size</Th>
//             <Th color="textMuted">Color</Th>
//             <Th color="textMuted">Price</Th>
//             <Th color="textMuted">Stock</Th>
//             <Th color="textMuted">Status</Th>
//             <Th color="textMuted" />
//           </Tr>
//         </Thead>
//         <Tbody>
//           {product.variants?.map((v) => (
//             <Tr key={v.variantId}>
//               <Td fontWeight="bold" fontSize="xs">
//                 {v.sku}
//               </Td>
//               <Td fontSize="xs" color="textSecondary">
//                 {v.size ?? "-"}
//               </Td>
//               <Td fontSize="xs" color="textSecondary">
//                 {v.color?.join(", ") ?? "-"}
//               </Td>
//               <Td fontWeight="600" fontSize="xs">
//                 ₦{v.price.toLocaleString()}
//               </Td>
//               <Td>
//                 <Input
//                   size="xs"
//                   w="60px"
//                   type="number"
//                   defaultValue={v.stockQuantity}
//                   onBlur={async (e) => {
//                     const stock = parseInt(e.target.value);
//                     if (!isNaN(stock)) {
//                       await updateStockMutation.mutateAsync(stock);
//                       invalidate();
//                     }
//                   }}
//                 />
//               </Td>
//               <Td>
//                 <Button
//                   size="xs"
//                   colorScheme={v.isActive ? "green" : "gray"}
//                   onClick={async () => {
//                     try {
//                       await toggleVariantMutation.mutateAsync(!v.isActive);
//                       invalidate();
//                     } catch (_) {}
//                   }}>
//                   {v.isActive ? "Active" : "Disabled"}
//                 </Button>
//               </Td>
//               <Td>
//                 <IconButton
//                   aria-label="Edit variant"
//                   icon={<PencilSimpleIcon size={12} />}
//                   size="xs"
//                   variant="ghost"
//                   onClick={() => onEditVariant(v)}
//                 />
//               </Td>
//             </Tr>
//           ))}

//           {!product.variants?.length && (
//             <Tr>
//               <Td colSpan={7} textAlign="center" py={4} color="textMuted">
//                 <Text fontSize="sm">No product variations registered.</Text>
//               </Td>
//             </Tr>
//           )}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// }
