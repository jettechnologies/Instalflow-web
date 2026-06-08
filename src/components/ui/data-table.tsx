import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
} from "@chakra-ui/react";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  enableRowSelection?: boolean;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getRowId?: (row: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  enableRowSelection = false,
  rowSelection = {},
  setRowSelection,
  getRowId,
}: DataTableProps<T>) {
  // Add a checkbox selection column if row selection is enabled
  const finalColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<T> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          colorScheme="purple"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={row.getIsSelected()}
          isDisabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          colorScheme="purple"
        />
      ),
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection as any,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box w="full" overflowX="auto">
      <Table variant="simple" size="md">
        <Thead bg="var(--bg-layer-1)" borderBottom="1px solid var(--border-structural)">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  color="var(--text-secondary)"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  borderColor="var(--border-structural)"
                  py={4}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                _hover={{ bg: "rgba(255, 255, 255, 0.02)" }}
                transition="background 0.2s"
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    color="var(--text-primary)"
                    fontSize="sm"
                    borderColor="var(--border-structural)"
                    py={4}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={finalColumns.length} textAlign="center" color="var(--text-muted)" py={8}>
                No entries available.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
