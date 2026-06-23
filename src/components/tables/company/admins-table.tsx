import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Box, Text } from "@chakra-ui/react";
import type {
  AdminUserResponse,
  UserActions,
} from "@utils/types/response-type";
import DataTable from "@components/shared/data-table";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@utils/misc";
import { AdminActionModal } from "@layouts/modal-layout/admin-action";
import { useMemo, useState } from "react";

interface AllAdminsTableProps {
  admins: AdminUserResponse[];
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

export const adminsColumn: ColumnDef<AdminUserResponse>[] = [
  {
    accessorKey: "name",
    header: "Admin",
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
    accessorKey: "role",
    header: "Role",
    cell: () => (
      <Badge
        bg="purple.100"
        color="purple.700"
        borderRadius="full"
        px="8px"
        py="2px"
        fontSize="xs">
        ADMIN
      </Badge>
    ),
  },

  {
    accessorKey: "marketerCount",
    header: () => <Text textAlign="center">Marketers</Text>,
    cell: ({ row }) => (
      <Text textAlign="center" fontWeight="600">
        {row.original.marketerCount}
      </Text>
    ),
  },

  {
    accessorKey: "_count.createdUsers",
    header: () => <Text textAlign="center">Users Created</Text>,
    cell: ({ row }) => (
      <Text textAlign="center" fontWeight="600">
        {row.original._count.createdUsers}
      </Text>
    ),
  },

  {
    accessorKey: "_count.requestedApprovals",
    header: () => <Text textAlign="center">Approvals</Text>,
    cell: ({ row }) => (
      <Text textAlign="center" fontWeight="600">
        {row.original._count.requestedApprovals}
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
      <Text fontSize="sm">{formatDate(getValue<string>())}</Text>
    ),
  },
];

export const AdminsTable = ({
  admins,
  isLoading,
  page,
  limit,
  totalCount,
  onPageChange,
  onItemsPerPageChange,
  onMouseEnter,
}: AllAdminsTableProps) => {
  const navigate = useNavigate();

  const [adminActionModal, setAdminActionModal] = useState<{
    adminId: string;
    action: UserActions | null;
  }>({
    adminId: "",
    action: null,
  });

  const selectedAdmin = useMemo(() => {
    if (adminActionModal.adminId === "") return null;
    return admins.find((m) => m.userId === adminActionModal.adminId);
  }, [admins, adminActionModal.adminId]);

  return (
    <>
      <DataTable<AdminUserResponse>
        data={admins}
        columns={adminsColumn}
        fetchLoading={isLoading}
        getRowId={(row) => row.userId}
        isInternalPagination
        tableAction={{
          actions: [
            {
              label: "View Details",
              onClick: (row) =>
                navigate({
                  to: `/company/admins/${row.original.userId}`,
                }),
            },
            {
              label: "Toggle Status",
              onClick: (row) =>
                setAdminActionModal({
                  adminId: row.original.userId,
                  action: "TOGGLE_STATUS",
                }),
            },
            {
              label: "Delete Admin",
              onClick: (row) =>
                setAdminActionModal({
                  adminId: row.original.userId,
                  action: "DELETE_ACCOUNT",
                }),
            },
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

      <AdminActionModal
        isOpen={!!adminActionModal.adminId}
        onClose={() => setAdminActionModal({ adminId: "", action: null })}
        adminId={adminActionModal.adminId}
        adminName={selectedAdmin?.name ?? "Admin"}
        active={selectedAdmin?.active ?? false}
        action={adminActionModal.action ?? "TOGGLE_STATUS"}
      />
    </>
  );
};
