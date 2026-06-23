import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Box, Text, Tooltip } from "@chakra-ui/react";
import { format } from "date-fns";
import type {
  MarketerUserResponse,
  UserActions,
} from "@utils/types/response-type";
import DataTable from "@components/shared/data-table";
import { useAuth } from "@context/auth-provider";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MarketerActionModal } from "@layouts/modal-layout/marketer-action";

interface AllMarketersTableProps {
  marketers: MarketerUserResponse[];
  isLoading?: boolean;
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onMouseEnter?: (page: number) => void;
}

const STATUS_META = {
  active: {
    label: "Active",
    bg: "green.100",
    color: "green.600",
  },
  inactive: {
    label: "Suspended",
    bg: "red.100",
    color: "red.600",
  },
} as const;

const marketerColumns: ColumnDef<MarketerUserResponse>[] = [
  {
    accessorKey: "name",
    header: "Marketer",
    cell: ({ row }) => (
      <Box>
        <Text fontSize="sm" fontWeight="600">
          {row.original.name}
        </Text>

        <Text fontSize="xs" color="gray.500">
          {row.original.email}
        </Text>
      </Box>
    ),
  },

  {
    accessorKey: "referralCode",
    header: "Referral Code",
    cell: ({ getValue }) => (
      <Tooltip label={getValue<string>()}>
        <Text
          fontSize="sm"
          maxW="220px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap">
          {getValue<string>()}
        </Text>
      </Tooltip>
    ),
  },

  {
    accessorKey: "_count.referredUsers",
    header: () => <Text textAlign="center">Customers</Text>,
    cell: ({ row }) => (
      <Text textAlign="center" fontWeight="600">
        {row.original._count.referredUsers}
      </Text>
    ),
  },

  {
    accessorKey: "active",
    header: "Status",
    cell: ({ getValue }) => {
      const active = getValue<boolean>();

      const meta = active ? STATUS_META.active : STATUS_META.inactive;

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

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => (
      <Text fontSize="sm">
        {format(new Date(getValue<string>()), "dd MMM yyyy")}
      </Text>
    ),
  },
];

export const MarketersTable = ({
  marketers,
  isLoading,
  page,
  limit,
  totalCount,
  onPageChange,
  onItemsPerPageChange,
  onMouseEnter,
}: AllMarketersTableProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role;

  const [marketerActionModal, setMarketerActionModal] = useState<{
    marketId: string;
    action: UserActions | null;
  }>({
    marketId: "",
    action: null,
  });

  const selectedMarketer = useMemo(() => {
    if (!user || marketerActionModal.marketId === "") return null;
    return marketers.find((m) => m.userId === marketerActionModal.marketId);
  }, [marketers, marketerActionModal.marketId]);

  const marketerActions = useMemo(
    () =>
      userRole === "COMPANY"
        ? [
            {
              label: "Toggle Status",
              onClick: (row: any) =>
                setMarketerActionModal({
                  marketId: row.original.userId,
                  action: "TOGGLE_STATUS",
                }),
            },
            {
              label: "Delete Marketer",
              onClick: (row: any) =>
                setMarketerActionModal({
                  marketId: row.original.userId,
                  action: "DELETE_ACCOUNT",
                }),
            },
          ]
        : userRole === "ADMIN"
          ? [
              {
                label: "Request Toggle Status",
                onClick: (row: any) =>
                  setMarketerActionModal({
                    marketId: row.original.userId,
                    action: "TOGGLE_STATUS",
                  }),
              },
              {
                label: "Request Delete Marketer",
                onClick: (row: any) =>
                  setMarketerActionModal({
                    marketId: row.original.userId,
                    action: "DELETE_ACCOUNT",
                  }),
              },
            ]
          : [],
    [userRole]
  );

  return (
    <>
      <DataTable<MarketerUserResponse>
        data={marketers}
        columns={marketerColumns}
        fetchLoading={isLoading}
        getRowId={(row) => row.userId}
        isInternalPagination
        tableAction={{
          actions: [
            {
              label: "View Details",
              onClick: (row) =>
                navigate({
                  to: `/company/marketers/${row.original.userId}`,
                }),
            },
            ...marketerActions,
          ],
        }}
        pagination={{
          currentPage: page,
          itemsPerPage: limit,
          pageSize: limit,
          totalCount,
          onPageChange,
          onItemsPerPageChange,
          onMouseEnter,
        }}
      />

      <MarketerActionModal
        isOpen={!!marketerActionModal.marketId}
        onClose={() => setMarketerActionModal({ marketId: "", action: null })}
        marketerId={marketerActionModal.marketId}
        marketerName={selectedMarketer?.name ?? ""}
        active={selectedMarketer?.active ?? false}
        role={(userRole ?? "COMPANY") as any}
        action={marketerActionModal.action ?? "TOGGLE_STATUS"}
      />
    </>
  );
};
