import { useCallback, useMemo, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  Row,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { OptionalSelectField } from "@components/forms/select";

export const DEFAULT_PAGE_SIZE = 10;

const checkboxThemeSx = {
  ".chakra-checkbox__control": {
    bg: "transparent",
    borderColor: "borderStructural",
    borderWidth: "1.5px",
    borderRadius: "6px",
    _checked: {
      bg: "brand.500",
      borderColor: "brand.500",
      color: "white",
      _hover: { bg: "brand.600", borderColor: "brand.600" },
    },
    _indeterminate: {
      bg: "brand.500",
      borderColor: "brand.500",
      color: "white",
    },
    _hover: { borderColor: "brand.500" },
  },
};

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onMouseEnter?: (page: number) => void;
};

export type ReactTableRowSelection = {
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

type BaseProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  fetchLoading?: boolean;
  onRowClick?: (row: Row<T>) => void;
  defaultVisibility?: Record<string, boolean>;
  enableRowSelection?: boolean;
  tableAction?: {
    excludedRows?: Array<{ field: keyof T; value: any }>;
    actions: Array<{
      label: string;
      onClick: (row: Row<T>) => void;
      onMouseEnter?: () => void;
    }>;
  };
  getRowId?: (row: T) => string;
} & ReactTableRowSelection;

type WithInternalPagination<T> = BaseProps<T> & {
  isInternalPagination: true;
  pagination: PaginationProps;
};

type WithoutInternalPagination<T> = BaseProps<T> & {
  isInternalPagination?: false;
  pagination?: never;
};

type Props<T> = WithInternalPagination<T> | WithoutInternalPagination<T>;

export default function DataTable<T>({
  columns,
  data,
  fetchLoading = false,
  onRowClick,
  defaultVisibility,
  tableAction,
  enableRowSelection = false,
  rowSelection,
  setRowSelection,
  getRowId,
  ...props
}: Props<T>) {
  const isInternalPagination = props.isInternalPagination === true;
  const pagination = isInternalPagination ? props.pagination : undefined;

  const [sorting, _setSorting] = useState<SortingState>([]);
  const [columnFilters, _setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultVisibility ?? {}
  );

  // Total page count — guarded against div-by-zero / empty datasets
  const pageCount = useMemo(() => {
    if (!pagination) return 0;
    return Math.max(
      1,
      Math.ceil(pagination.totalCount / pagination.itemsPerPage)
    );
  }, [pagination]);

  const generatePageNumbers = useCallback(() => {
    if (!pagination) return [] as number[];
    const delta = 2;
    const currentPage = pagination.currentPage;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pageCount - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }, [pagination, pageCount]);

  const pageNumbers = generatePageNumbers();

  const selectionColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: "__select",
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllPageRowsSelected()}
          isIndeterminate={table.getIsSomePageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          sx={checkboxThemeSx}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          sx={checkboxThemeSx}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }),
    []
  );

  const actionColumn = useMemo<ColumnDef<T> | null>(() => {
    if (!tableAction) return null;

    return {
      id: "__actions",
      header: "",
      cell: ({ row }) => {
        const excluded = tableAction.excludedRows?.some(
          (e) => row.original[e.field] === e.value
        );
        if (excluded) return null;

        return (
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                variant="ghost"
                color="textSecondary"
                _hover={{ color: "textPrimary", bg: "whiteAlpha.100" }}
                onClick={(e) => e.stopPropagation()}>
                <DotsThreeVertical size={16} />
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                w="160px"
                bg="bgLayer2"
                border="1px solid"
                borderColor="borderStructural"
                borderRadius="12px"
                boxShadow="0 8px 32px rgba(0,0,0,0.48)"
                _focus={{ outline: "none" }}>
                <PopoverBody
                  p="6px"
                  display="flex"
                  flexDirection="column"
                  gap="2px">
                  {tableAction.actions.map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant="ghost"
                      justifyContent="flex-start"
                      fontWeight={400}
                      fontSize="13px"
                      color="textPrimary"
                      borderRadius="8px"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(row);
                      }}
                      onMouseEnter={action.onMouseEnter}>
                      {action.label}
                    </Button>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    };
  }, [tableAction]);

  const finalColumns = useMemo(() => {
    return [
      ...(enableRowSelection ? [selectionColumn] : []),
      ...columns,
      ...(actionColumn ? [actionColumn] : []),
    ];
  }, [columns, enableRowSelection, selectionColumn, actionColumn]);

  const hasActions = useMemo(
    () => finalColumns.some((c) => c.id === "__actions"),
    [finalColumns]
  );

  useEffect(() => {
    if (defaultVisibility) setColumnVisibility(defaultVisibility);
  }, [defaultVisibility]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    manualPagination: isInternalPagination,
    pageCount: isInternalPagination ? pageCount : undefined,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(isInternalPagination && {
        pagination: {
          pageIndex: pagination!.currentPage - 1,
          pageSize: pagination!.pageSize,
        },
      }),
    },
    onPaginationChange: isInternalPagination
      ? (updater) => {
          const next =
            typeof updater === "function"
              ? updater({
                  pageIndex: pagination!.currentPage - 1,
                  pageSize: pagination!.pageSize,
                })
              : updater;
          pagination!.onPageChange(next.pageIndex + 1);
          pagination!.onPageSizeChange?.(next.pageSize);
        }
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(isInternalPagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
  });

  const getColumnLabel = (
    col: ReturnType<typeof table.getAllLeafColumns>[number]
  ) => {
    const meta = col.columnDef.meta as { mobileLabel?: string } | undefined;
    if (meta?.mobileLabel) return meta.mobileLabel;
    const header = col.columnDef.header;
    if (typeof header === "string") return header;
    return col.id.replace(/^__/, "").replace(/[_-]/g, " ");
  };

  const rows = table.getRowModel().rows;

  return (
    <Box
      w="full"
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="16px"
      overflow="hidden">
      <Box overflowX="auto" display={{ base: "none", lg: "block" }}>
        <Table size="sm" minW="max-content">
          <Thead bg="bgLayer1">
            {table.getHeaderGroups().map((group) => (
              <Tr key={group.id}>
                {group.headers.map((header) => (
                  <Th
                    key={header.id}
                    fontSize="11px"
                    textTransform="uppercase"
                    letterSpacing="0.04em"
                    color="textSecondary"
                    fontWeight={600}
                    borderColor="borderStructural"
                    px="16px"
                    py="12px"
                    height="56px">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {fetchLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Tr key={i}>
                  {table.getVisibleLeafColumns().map((_, j) => (
                    <Td key={j} borderColor="borderStructural" height="62px">
                      <Skeleton
                        h="16px"
                        startColor="bgLayer1"
                        endColor="borderStructural"
                      />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <Tr
                  key={row.id}
                  cursor={onRowClick ? "pointer" : "default"}
                  _hover={onRowClick ? { bg: "whiteAlpha.50" } : undefined}
                  transition="background 0.15s ease"
                  onClick={() => onRowClick?.(row)}
                  role="group">
                  {row.getVisibleCells().map((cell) => {
                    const isActionsCell = cell.column.id === "__actions";
                    return (
                      <Td
                        key={cell.id}
                        whiteSpace="nowrap"
                        height="62px"
                        px="16px"
                        py="12px"
                        fontSize="14px"
                        color="textPrimary"
                        borderColor="borderStructural">
                        {isActionsCell && hasActions ? (
                          <Box
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            transition="opacity 0.15s ease"
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            gap={2}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Box>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td
                  colSpan={finalColumns.length}
                  py={10}
                  textAlign="center"
                  color="textMuted"
                  fontSize="14px"
                  borderColor="borderStructural">
                  No results found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Box
        display={{ base: "block", lg: "none" }}
        p={{ base: "12px", md: "16px" }}>
        {fetchLoading ? (
          <VStack spacing="10px" align="stretch">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                bg="bgLayer1"
                border="1px solid"
                borderColor="borderStructural"
                borderRadius="12px"
                p="14px">
                <Skeleton
                  h="14px"
                  mb="10px"
                  w="40%"
                  startColor="bgLayer2"
                  endColor="borderStructural"
                />
                <Skeleton
                  h="12px"
                  mb="6px"
                  startColor="bgLayer2"
                  endColor="borderStructural"
                />
                <Skeleton
                  h="12px"
                  w="70%"
                  startColor="bgLayer2"
                  endColor="borderStructural"
                />
              </Box>
            ))}
          </VStack>
        ) : rows.length ? (
          <VStack spacing="10px" align="stretch">
            {rows.map((row) => {
              const fieldCells = row
                .getVisibleCells()
                .filter(
                  (c) =>
                    c.column.id !== "__select" && c.column.id !== "__actions"
                );
              const selectCell = row
                .getVisibleCells()
                .find((c) => c.column.id === "__select");
              const actionCell = row
                .getVisibleCells()
                .find((c) => c.column.id === "__actions");

              return (
                <Box
                  key={row.id}
                  bg="bgLayer1"
                  border="1px solid"
                  borderColor="borderStructural"
                  borderRadius="12px"
                  overflow="hidden"
                  cursor={onRowClick ? "pointer" : "default"}
                  onClick={() => onRowClick?.(row)}
                  _active={
                    onRowClick ? { borderColor: "brand.500" } : undefined
                  }
                  transition="border-color 0.15s ease">
                  {(selectCell || actionCell) && (
                    <Flex
                      align="center"
                      justify="space-between"
                      px="14px"
                      py="8px"
                      borderBottom="1px solid"
                      borderColor="borderStructural"
                      onClick={(e) => selectCell && e.stopPropagation()}>
                      {selectCell ? (
                        flexRender(
                          selectCell.column.columnDef.cell,
                          selectCell.getContext()
                        )
                      ) : (
                        <Box />
                      )}
                      {actionCell &&
                        flexRender(
                          actionCell.column.columnDef.cell,
                          actionCell.getContext()
                        )}
                    </Flex>
                  )}

                  <VStack spacing="0" align="stretch" px="14px" py="4px">
                    {fieldCells.map((cell, i) => (
                      <Flex
                        key={cell.id}
                        justify="space-between"
                        align="flex-start"
                        gap="12px"
                        py="10px"
                        borderBottom={
                          i < fieldCells.length - 1 ? "1px solid" : "none"
                        }
                        borderColor="whiteAlpha.100">
                        <Text
                          fontSize="11px"
                          fontWeight={600}
                          textTransform="uppercase"
                          letterSpacing="0.03em"
                          color="textMuted"
                          flexShrink={0}
                          pt="2px">
                          {getColumnLabel(cell.column)}
                        </Text>
                        <Box
                          fontSize="14px"
                          color="textPrimary"
                          textAlign="right">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        ) : (
          <Text textAlign="center" color="textMuted" fontSize="14px" py={10}>
            No results found
          </Text>
        )}
      </Box>

      {isInternalPagination && pagination && (
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={3}
          px="16px"
          py="12px"
          borderTop="1px solid"
          borderColor="borderStructural">
          <Text fontSize="13px" color="textSecondary">
            Page {pagination.currentPage} of {pageCount}
          </Text>

          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            gap={3}>
            <Box minW={{ base: "auto", sm: "150px" }}>
              <OptionalSelectField
                options={[5, 10, 20, 30, 50].map((s) => ({
                  label: `${s} per page`,
                  value: s,
                }))}
                defaultValue={pagination.itemsPerPage}
                fontSize="13px"
                height="38px"
                onChange={(selectedOption: any) =>
                  pagination.onItemsPerPageChange(Number(selectedOption.value))
                }
              />
            </Box>

            <HStack spacing={1.5} justify="center">
              <Button
                aria-label="Previous page"
                variant="ghost"
                color="textSecondary"
                _hover={{ color: "textPrimary", bg: "whiteAlpha.100" }}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                isDisabled={pagination.currentPage === 1}
                p={2}
                minWidth="32px"
                h="32px">
                <CaretLeftIcon size={16} />
              </Button>

              <HStack spacing={1.5} display={{ base: "none", sm: "flex" }}>
                <Button
                  onClick={() => pagination.onPageChange(1)}
                  px={3}
                  minWidth="32px"
                  h="32px"
                  fontSize="13px"
                  borderRadius="8px"
                  bg={pagination.currentPage === 1 ? "brand.500" : "bgLayer1"}
                  color={
                    pagination.currentPage === 1 ? "white" : "textSecondary"
                  }
                  border="1px solid"
                  borderColor={
                    pagination.currentPage === 1
                      ? "brand.500"
                      : "borderStructural"
                  }
                  _hover={{
                    bg:
                      pagination.currentPage === 1
                        ? "brand.600"
                        : "whiteAlpha.100",
                  }}>
                  1
                </Button>

                {pageNumbers[0] > 2 && (
                  <Text color="textMuted" fontSize="13px">
                    …
                  </Text>
                )}

                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    onClick={() => pagination.onPageChange(page)}
                    px={3}
                    minWidth="32px"
                    h="32px"
                    fontSize="13px"
                    borderRadius="8px"
                    bg={
                      pagination.currentPage === page ? "brand.500" : "bgLayer1"
                    }
                    color={
                      pagination.currentPage === page
                        ? "white"
                        : "textSecondary"
                    }
                    border="1px solid"
                    borderColor={
                      pagination.currentPage === page
                        ? "brand.500"
                        : "borderStructural"
                    }
                    _hover={{
                      bg:
                        pagination.currentPage === page
                          ? "brand.600"
                          : "whiteAlpha.100",
                    }}>
                    {page}
                  </Button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < pageCount - 1 && (
                  <Text color="textMuted" fontSize="13px">
                    …
                  </Text>
                )}

                {pageCount > 1 && (
                  <Button
                    onClick={() => pagination.onPageChange(pageCount)}
                    px={3}
                    minWidth="32px"
                    h="32px"
                    fontSize="13px"
                    borderRadius="8px"
                    bg={
                      pagination.currentPage === pageCount
                        ? "brand.500"
                        : "bgLayer1"
                    }
                    color={
                      pagination.currentPage === pageCount
                        ? "white"
                        : "textSecondary"
                    }
                    border="1px solid"
                    borderColor={
                      pagination.currentPage === pageCount
                        ? "brand.500"
                        : "borderStructural"
                    }
                    _hover={{
                      bg:
                        pagination.currentPage === pageCount
                          ? "brand.600"
                          : "whiteAlpha.100",
                    }}>
                    {pageCount}
                  </Button>
                )}
              </HStack>

              <Button
                aria-label="Next page"
                variant="ghost"
                color="textSecondary"
                _hover={{ color: "textPrimary", bg: "whiteAlpha.100" }}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                isDisabled={pagination.currentPage === pageCount}
                p={2}
                minWidth="32px"
                h="32px">
                <CaretRightIcon size={16} />
              </Button>
            </HStack>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type RowSelectionState,
// } from "@tanstack/react-table";
// import type {
//   ColumnDef,
//   Row,
//   SortingState,
//   ColumnFiltersState,
//   VisibilityState,
// } from "@tanstack/react-table";
// import {
//   Box,
//   Button,
//   Flex,
//   Skeleton,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   Checkbox,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverBody,
//   PopoverArrow,
//   Portal,
//   HStack,
//   useBreakpointValue,
// } from "@chakra-ui/react";
// import {
//   CaretLeftIcon,
//   CaretRightIcon,
//   DotsThreeVertical,
// } from "@phosphor-icons/react";
// import { SelectField } from "@components/forms/select";

// /* eslint-disable */

// export const DEFAULT_PAGE_SIZE = 10;

// type PaginationProps = {
//   currentPage: number;
//   pageSize: number;
//   itemsPerPage: number;
//   onItemsPerPageChange: (size: number) => void;
//   totalCount: number;
//   onPageChange: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
//   onMouseEnter?: (page: number) => void;
// };

// export type ReactTableRowSelection = {
//   rowSelection?: RowSelectionState;
//   setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
// };

// type BaseProps<T> = {
//   columns: ColumnDef<T>[];
//   data: T[];
//   fetchLoading?: boolean;
//   onRowClick?: (row: Row<T>) => void;
//   defaultVisibility?: Record<string, boolean>;
//   enableRowSelection?: boolean;
//   tableAction?: {
//     excludedRows?: Array<{ field: keyof T; value: any }>;
//     actions: Array<{
//       label: string;
//       onClick: (row: Row<T>) => void;
//       onMouseEnter?: () => void;
//     }>;
//   };
//   getRowId?: (row: T) => string;
// } & ReactTableRowSelection;

// type WithInternalPagination<T> = BaseProps<T> & {
//   isInternalPagination: true;
//   pagination: PaginationProps;
// };

// type WithoutInternalPagination<T> = BaseProps<T> & {
//   isInternalPagination?: false;
//   pagination?: never;
// };

// type Props<T> = WithInternalPagination<T> | WithoutInternalPagination<T>;

// export default function DataTable<T>({
//   columns,
//   data,
//   fetchLoading = false,
//   onRowClick,
//   defaultVisibility,
//   tableAction,
//   enableRowSelection = false,
//   rowSelection,
//   setRowSelection,
//   getRowId,
//   ...props
// }: Props<T>) {
//   const isInternalPagination = props.isInternalPagination === true;
//   const pagination = isInternalPagination ? props.pagination : undefined;

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
//     defaultVisibility ?? {}
//   );

//   const isDesktop = useBreakpointValue({ base: false, lg: true });

//   const pageCount =
//     pagination && Math.ceil(pagination.totalCount / pagination.itemsPerPage);

//   const generatePageNumbers = useCallback(() => {
//     if (!pagination) return;

//     const delta = 2;
//     const currentPage = pagination.currentPage;
//     const totalPages = pagination.pageSize;
//     const range: number[] = [];

//     for (
//       let i = Math.max(2, currentPage - delta);
//       i <= Math.min(totalPages - 1, currentPage + delta);
//       i++
//     ) {
//       range.push(i);
//     }

//     return range;
//   }, [pagination]);

//   const pageNumbers = generatePageNumbers();

//   const selectionColumn = useMemo<ColumnDef<T>>(
//     () => ({
//       id: "__select",
//       header: ({ table }) => {
//         return (
//           <Checkbox
//             isChecked={table.getIsAllPageRowsSelected()}
//             isIndeterminate={table.getIsSomePageRowsSelected()}
//             onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
//           />
//         );
//       },
//       cell: ({ row }) => (
//         <Checkbox
//           isChecked={row.getIsSelected()}
//           onChange={(e) => row.toggleSelected(e.target.checked)}
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//       size: 40,
//     }),
//     []
//   );

//   const actionColumn = useMemo<ColumnDef<T> | null>(() => {
//     if (!tableAction) return null;

//     return {
//       id: "__actions",
//       header: "",
//       cell: ({ row }) => {
//         const excluded = tableAction.excludedRows?.some(
//           (e) => row.original[e.field] === e.value
//         );

//         if (excluded) return null;

//         return (
//           <Popover>
//             <PopoverTrigger>
//               <Button size="sm" variant="ghost">
//                 <DotsThreeVertical size={16} />
//               </Button>
//             </PopoverTrigger>
//             <Portal>
//               <PopoverContent w="120px">
//                 <PopoverArrow />
//                 <PopoverBody>
//                   {tableAction.actions.map((action) => (
//                     <Button
//                       key={action.label}
//                       size="sm"
//                       variant="link"
//                       onClick={() => action.onClick(row)}
//                       onMouseEnter={action.onMouseEnter}>
//                       {action.label}
//                     </Button>
//                   ))}
//                 </PopoverBody>
//               </PopoverContent>
//             </Portal>
//           </Popover>
//         );
//       },
//       enableSorting: false,
//       enableHiding: false,
//       size: 40,
//     };
//   }, [tableAction]);

//   const finalColumns = useMemo(() => {
//     return [
//       ...(enableRowSelection ? [selectionColumn] : []),
//       ...columns,
//       ...(actionColumn ? [actionColumn] : []),
//     ];
//   }, [columns, enableRowSelection, selectionColumn, actionColumn]);

//   useEffect(() => {
//     if (defaultVisibility) {
//       setColumnVisibility(defaultVisibility);
//     }
//   }, [defaultVisibility]);

//   const table = useReactTable({
//     data,
//     columns: finalColumns,

//     manualPagination: isInternalPagination,
//     pageCount: isInternalPagination
//       ? Math.ceil(pagination!.totalCount / pagination!.itemsPerPage)
//       : undefined,
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     getRowId,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       ...(isInternalPagination && {
//         pagination: {
//           pageIndex: pagination!.currentPage - 1,
//           pageSize: pagination!.pageSize,
//         },
//       }),
//     },

//     onPaginationChange: isInternalPagination
//       ? (updater) => {
//           const next =
//             typeof updater === "function"
//               ? updater({
//                   pageIndex: pagination!.currentPage - 1,
//                   pageSize: pagination!.pageSize,
//                 })
//               : updater;

//           pagination!.onPageChange(next.pageIndex + 1);
//           pagination!.onPageSizeChange?.(next.pageSize);
//         }
//       : undefined,

//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     ...(isInternalPagination && {
//       getPaginationRowModel: getPaginationRowModel(),
//     }),
//   });

//   return (
//     <Box
//       w="full"
//       borderWidth="1px"
//       borderRadius="xl"
//       overflow="hidden"
//       bg="white">
//       <Box overflowX="auto">
//         <Table size="sm" minW="max-content">
//           <Thead bg="var(--gray-50)">
//             {table.getHeaderGroups().map((group) => (
//               <Tr key={group.id}>
//                 {group.headers.map((header) => (
//                   <Th
//                     key={header.id}
//                     fontSize="sm"
//                     color="var(--gray-600)"
//                     fontWeight="600"
//                     px="16px"
//                     py="12px"
//                     height="70px">
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </Th>
//                 ))}
//               </Tr>
//             ))}
//           </Thead>

//           <Tbody>
//             {fetchLoading ? (
//               Array.from({ length: 5 }).map((_, i) => (
//                 <Tr key={i}>
//                   {table.getVisibleLeafColumns().map((_, j) => (
//                     <Td key={j}>
//                       <Skeleton h="20px" />
//                     </Td>
//                   ))}
//                 </Tr>
//               ))
//             ) : table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => {
//                 const hasActions = table
//                   .getHeaderGroups()
//                   .some((g) => g.headers.some((h) => h.id === "actions"));

//                 return (
//                   <Tr
//                     key={row.id}
//                     cursor={onRowClick ? "pointer" : "default"}
//                     _hover={onRowClick ? { bg: "var(--gray-50)" } : undefined}
//                     transition="background 0.15s ease"
//                     onClick={() => onRowClick?.(row)}
//                     role="group">
//                     {row.getVisibleCells().map((cell) => {
//                       const isActionsCell = cell.column.id === "actions";
//                       return (
//                         <Td
//                           key={cell.id}
//                           whiteSpace="nowrap"
//                           height="73px"
//                           px="16px"
//                           py="12px">
//                           {isActionsCell && hasActions ? (
//                             <Box
//                               display="none"
//                               _groupHover={{ display: "flex" }}
//                               justifyContent="flex-end"
//                               alignItems="center"
//                               gap={2}>
//                               {flexRender(
//                                 cell.column.columnDef.cell,
//                                 cell.getContext()
//                               )}
//                             </Box>
//                           ) : (
//                             flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )
//                           )}
//                         </Td>
//                       );
//                     })}
//                   </Tr>
//                 );
//               })
//             ) : (
//               <Tr>
//                 <Td colSpan={finalColumns.length} py={8} textAlign="center">
//                   No results found
//                 </Td>
//               </Tr>
//             )}
//           </Tbody>
//         </Table>
//       </Box>

//       {/* PAGINATION */}
//       {isInternalPagination && pagination && (
//         <Flex
//           justify="space-between"
//           align="center"
//           mt={4}
//           gap={4}
//           px="16px"
//           py="12px">
//           <Text fontSize="sm">
//             Page {pagination.currentPage} of {pageCount}
//           </Text>

//           <HStack spacing={4}>
//             <SelectField
//               name="items_per_page"
//               options={[5, 10, 20, 30, 50].map((s) => ({
//                 label: `${s} per page`,
//                 value: s,
//               }))}
//               defaultValue={pagination.itemsPerPage}
//               fontSize="14px"
//               fontWeight="400"
//               onChange={(selectedOption) =>
//                 pagination.onItemsPerPageChange(Number(selectedOption.value))
//               }
//             />

//             <HStack spacing={2} justify="center">
//               {/* Previous Button */}
//               <Button
//                 variant="ghost"
//                 onClick={() =>
//                   pagination.onPageChange(pagination.currentPage - 1)
//                 }
//                 disabled={pagination.currentPage === 1}
//                 p={2}
//                 minWidth="10px">
//                 <CaretLeftIcon />
//               </Button>

//               {/* First page */}
//               <Button
//                 onClick={() => pagination.onPageChange(1)}
//                 px={3}
//                 py={2}
//                 minWidth="10px"
//                 h="36px"
//                 rounded="xl"
//                 bg={pagination.currentPage === 1 ? "black" : "var(--gray-50)"}
//                 color={pagination.currentPage === 1 ? "white" : "black"}>
//                 1
//               </Button>

//               {/* Ellipsis before page numbers */}
//               {pageNumbers && pageNumbers[0] > 2 && <Text>...</Text>}

//               {/* Dynamic page numbers */}
//               {pageNumbers?.map((page) => (
//                 <Button
//                   key={page}
//                   onClick={() => pagination.onPageChange(page)}
//                   px={3}
//                   py={2}
//                   h="36px"
//                   minWidth="10px"
//                   rounded="xl"
//                   bg={
//                     pagination.currentPage === page ? "black" : "var(--gray-50)"
//                   }
//                   color={pagination.currentPage === page ? "white" : "black"}>
//                   {page}
//                 </Button>
//               ))}

//               {/* Ellipsis after page numbers */}
//               {pageNumbers &&
//                 pageNumbers[pageNumbers.length - 1] <
//                   pagination.pageSize - 1 && <Text>...</Text>}

//               {/* Last page */}
//               {pagination.pageSize > 1 && (
//                 <Button
//                   onClick={() => pagination.onPageChange(pagination.pageSize)}
//                   px={3}
//                   py={2}
//                   rounded="xl"
//                   minWidth="10px"
//                   bg={
//                     pagination.currentPage === pagination.pageSize
//                       ? "black"
//                       : "var(--gray-50)"
//                   }
//                   color={
//                     pagination.currentPage === pagination.pageSize
//                       ? "white"
//                       : "black"
//                   }>
//                   {pagination.pageSize}
//                 </Button>
//               )}

//               {/* Next Button */}
//               <Button
//                 variant="ghost"
//                 onClick={() =>
//                   pagination.onPageChange(pagination.currentPage + 1)
//                 }
//                 disabled={pagination.currentPage === pagination.pageSize}
//                 p={2}
//                 minWidth="10px">
//                 <CaretRightIcon />
//               </Button>

//               {/* Mobile fallback */}
//               {!isDesktop && (
//                 <Box fontSize="sm">
//                   Page {pagination.currentPage} of {pagination.totalCount}
//                 </Box>
//               )}
//             </HStack>
//           </HStack>
//         </Flex>
//       )}
//     </Box>
//   );
// }

// import { useState } from "react";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type Row,
//   type SortingState,
//   type VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Button,
//   Box,
//   Flex,
//   Text,
//   Icon,
//   Skeleton,
// } from "@chakra-ui/react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// type Props<T> = {
//   columns: ColumnDef<T>[];
//   data: T[];
//   onRowClick?: (row: Row<T>) => void;
//   defaultVisibility?: Record<string, boolean>;
//   loading?: boolean; // NEW: loading state prop
// };

// export default function DataGrid<T>({
//   defaultVisibility,
//   columns,
//   data,
//   onRowClick,
//   loading = false, // NEW: default false
// }: Props<T>) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
//     defaultVisibility || {}
//   );
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <Box w="full" overflowX="auto">
//       <Table variant="simple" size="sm">
//         <Thead bg="gray.50">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <Tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <Th
//                   key={header.id}
//                   fontSize="sm"
//                   fontWeight="semibold"
//                   whiteSpace="nowrap">
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </Th>
//               ))}
//             </Tr>
//           ))}
//         </Thead>
//         <Tbody>
//           {loading ? (
//             // Show skeleton loaders when loading
//             Array.from({ length: 5 }).map((_, index) => (
//               <Tr key={index}>
//                 {columns.map((_, colIdx) => (
//                   <Td key={colIdx}>
//                     <Skeleton height="20px" />
//                   </Td>
//                 ))}
//               </Tr>
//             ))
//           ) : table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <Tr
//                 key={row.id}
//                 cursor={onRowClick ? "pointer" : "default"}
//                 _hover={onRowClick ? { bg: "gray.50" } : undefined}
//                 onClick={() => onRowClick?.(row)}
//                 bg={row.getIsSelected() ? "gray.100" : "transparent"}>
//                 {row.getVisibleCells().map((cell) => (
//                   <Td
//                     key={cell.id}
//                     fontSize="sm"
//                     fontWeight="medium"
//                     whiteSpace="nowrap"
//                     p={4}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </Td>
//                 ))}
//               </Tr>
//             ))
//           ) : (
//             <Tr>
//               <Td colSpan={columns.length} textAlign="center" py={10}>
//                 No results.
//               </Td>
//             </Tr>
//           )}
//         </Tbody>
//       </Table>

//       <Flex
//         align="center"
//         justify="space-between"
//         px={4}
//         py={3}
//         flexWrap="wrap"
//         gap={3}>
//         <Text fontSize="sm">
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </Text>
//         <Flex gap={2}>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             isDisabled={!table.getCanPreviousPage() || loading}
//             leftIcon={<Icon as={ArrowLeft} boxSize={4} />}>
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             isDisabled={!table.getCanNextPage() || loading}
//             rightIcon={<Icon as={ArrowRight} boxSize={4} />}>
//             Next
//           </Button>
//         </Flex>
//       </Flex>
//     </Box>
//   );
// }
