import type { ColumnDef, Row } from "@tanstack/react-table";
import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { formatCurrency } from "@utils/misc";
import DataTable from "@components/shared/data-table";
import { useMemo, useState } from "react";
import type { KycApplication, KycStatus } from "@utils/types/response-type";
import { ApplicationApproveModal } from "@layouts/modal-layout/application-approve-modal";
import { ApplicationRejectModal } from "@layouts/modal-layout/application-reject-modal";
import { ApplicationDocumentModal } from "@layouts/modal-layout/application-document-modal";

interface CompanyApplicationsTableProps {
  applications: KycApplication[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onRowClick?: (application: KycApplication) => void;
  onMouseEnter?: (page: number) => void;
}

const STATUS_LABEL: Record<KycStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const tone: Record<KycStatus, { bg: string; fg: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.14)", fg: "#F59E0B" },
  APPROVED: { bg: "rgba(16,185,129,0.16)", fg: "#10B981" },
  REJECTED: { bg: "rgba(239,68,68,0.14)", fg: "#EF4444" },
};

function SigPill({ label, signed }: { label: string; signed: boolean }) {
  return (
    <HStack
      spacing={1}
      px={2}
      py={0.5}
      borderRadius="full"
      bg={signed ? "rgba(16,185,129,0.12)" : "rgba(148,163,184,0.08)"}
      color={signed ? "#34D399" : "textMuted"}
      fontSize="10px"
      fontWeight={700}
      letterSpacing="0.05em">
      {signed ? "✓" : "✗"}
      <Text>{label.toUpperCase()}</Text>
    </HStack>
  );
}

const applicationsColumns: ColumnDef<KycApplication>[] = [
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <Box>
          <Text fontSize="sm" fontWeight="600" color="textPrimary">
            {app.user?.name || app.onboardingSession.name}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {app.user?.email || app.onboardingSession.email}
          </Text>
        </Box>
      );
    },
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <Box>
          <Text fontSize="sm" fontWeight="600" color="textPrimary">
            {app.product?.name}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {formatCurrency(Number(app.financingContract?.totalFinanced || 0))}
          </Text>
        </Box>
      );
    },
  },
  {
    id: "marketer",
    header: "Marketer",
    cell: ({ row }) => {
      const marketer = row.original.user?.referredByMarketer;
      return (
        <Text fontSize="sm" color="textSecondary">
          {marketer?.name ?? "Direct"}
        </Text>
      );
    },
  },
  {
    id: "signatures",
    header: "Signatures",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <HStack spacing={2}>
          <SigPill label="Mkt" signed={app.marketerApproved} />
          <SigPill label="Adm" signed={app.adminApproved} />
        </HStack>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const app = row.original;
      const t = tone[app.status];
      return (
        <Badge
          bg={t.bg}
          color={t.fg}
          px={2.5}
          py={1}
          borderRadius="full"
          fontSize="10px"
          fontWeight={700}
          letterSpacing="0.05em">
          {STATUS_LABEL[app.status].toUpperCase()}
        </Badge>
      );
    },
  },
];

export const CompanyApplicationsTable = ({
  applications,
  pagination,
  isLoading,
  onPageChange,
  onItemsPerPageChange,
  onRowClick,
  onMouseEnter,
}: CompanyApplicationsTableProps) => {
  const [approveModal, setApproveModal] = useState<{
    applicationId: string;
    applicationName: string;
  } | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    applicationId: string;
    applicationName: string;
  } | null>(null);
  const [documentModal, setDocumentModal] = useState<string | null>(null);

  const tableActions = useMemo(() => {
    return [
      {
        label: "View details",
        onClick: (row: Row<KycApplication>) => {
          onRowClick?.(row.original);
        },
      },
      {
        label: "View bank statement",
        onClick: (row: Row<KycApplication>) => {
          setDocumentModal(row.original.kycApplicationId);
        },
      },
      {
        label: "Sign admin approval",
        onClick: (row: Row<KycApplication>) => {
          const app = row.original;
          if (app.status === "PENDING" && !app.adminApproved) {
            setApproveModal({
              applicationId: app.kycApplicationId,
              applicationName: app.user?.name || app.onboardingSession.name,
            });
          }
        },
      },
      {
        label: "Reject",
        onClick: (row: Row<KycApplication>) => {
          const app = row.original;
          if (app.status === "PENDING") {
            setRejectModal({
              applicationId: app.kycApplicationId,
              applicationName: app.user?.name || app.onboardingSession.name,
            });
          }
        },
      },
    ];
  }, []);

  return (
    <Box>
      <DataTable<KycApplication>
        data={applications}
        columns={applicationsColumns}
        fetchLoading={isLoading}
        getRowId={(row) => row.kycApplicationId}
        isInternalPagination
        onRowClick={onRowClick ? (row) => onRowClick(row.original) : undefined}
        tableAction={{ actions: tableActions }}
        pagination={{
          currentPage: pagination.currentPage,
          itemsPerPage: pagination.limit,
          pageSize: pagination.limit,
          totalCount: pagination.total,
          onPageChange,
          onItemsPerPageChange,
          onMouseEnter,
        }}
      />

      {!!approveModal && (
        <ApplicationApproveModal
          isOpen={!!approveModal}
          onClose={() => setApproveModal(null)}
          applicationId={approveModal.applicationId}
          applicationName={approveModal.applicationName}
        />
      )}

      {!!rejectModal && (
        <ApplicationRejectModal
          isOpen={!!rejectModal}
          onClose={() => setRejectModal(null)}
          applicationId={rejectModal.applicationId}
          applicationName={rejectModal.applicationName}
        />
      )}

      {!!documentModal && (
        <ApplicationDocumentModal
          isOpen={!!documentModal}
          onClose={() => setDocumentModal(null)}
          applicationId={documentModal}
        />
      )}
    </Box>
  );
};
