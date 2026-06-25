// components/tables/approvals-table.tsx

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { format } from "date-fns";
import DataTable from "@components/shared/data-table";
import { useMemo, useState } from "react";
import type {
  ApprovalAction,
  ApprovalRequest,
  ApprovalStatus,
  ReviewAction,
} from "@utils/types/response-type";
import { ApprovalActionModal } from "@layouts/modal-layout/approval-action";

interface ApprovalsTableProps {
  requests: ApprovalRequest[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  isLoading?: boolean;
  status: ApprovalStatus;
  onStatusChange: (status: ApprovalStatus) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onMouseEnter?: (page: number) => void;
}

const STATUS_TABS: Array<{ label: string; value: ApprovalStatus }> = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_META: Record<
  ApprovalStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "rgba(245,158,11,0.12)",
    color: "#F59E0B",
  },
  APPROVED: {
    label: "Approved",
    bg: "rgba(16,185,129,0.12)",
    color: "#10B981",
  },
  REJECTED: {
    label: "Rejected",
    bg: "rgba(239,68,68,0.12)",
    color: "#EF4444",
  },
};

const ACTION_LABEL: Record<string, string> = {
  TOGGLE_ACTIVE: "Toggle Status",
  DELETE_ACCOUNT: "Delete Account",
};

const approvalColumns: ColumnDef<ApprovalRequest>[] = [
  {
    id: "targetUser",
    header: "Target User",
    cell: ({ row }) => {
      const { name, email, active } = row.original.targetUser;
      return (
        <Box>
          <Flex align="center" gap="6px">
            <Text fontSize="sm" fontWeight={600} color="textPrimary">
              {name}
            </Text>
            <Box
              as="span"
              display="inline-block"
              w="6px"
              h="6px"
              borderRadius="full"
              bg={active ? "statusSuccess" : "statusDanger"}
              flexShrink={0}
              title={active ? "Account active" : "Account inactive"}
            />
          </Flex>
          <Text fontSize="xs" color="textSecondary">
            {email}
          </Text>
        </Box>
      );
    },
  },
  {
    id: "requestedBy",
    header: "Requested By",
    cell: ({ row }) => {
      const { name, email } = row.original.requestedBy;
      return (
        <Box>
          <Text fontSize="sm" fontWeight={600} color="textPrimary">
            {name}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {email}
          </Text>
        </Box>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ getValue }) => {
      const raw = getValue<string>();
      const label = ACTION_LABEL[raw] ?? raw;
      return (
        <Badge
          bg="rgba(124,58,237,0.12)"
          color="brand.400"
          borderRadius="full"
          px="8px"
          py="2px"
          fontSize="xs"
          textTransform="none"
          fontWeight={500}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ getValue }) => {
      const reason = getValue<string | undefined>();
      if (!reason) {
        return (
          <Text fontSize="sm" color="textMuted">
            —
          </Text>
        );
      }

      return (
        <Tooltip label={reason} placement="top" hasArrow>
          <Text
            fontSize="sm"
            maxW="220px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {reason}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue<ApprovalStatus>();
      const meta = STATUS_META[s];
      return (
        <Badge
          bg={meta.bg}
          color={meta.color}
          borderRadius="full"
          px="8px"
          py="2px"
          fontSize="xs"
          textTransform="none"
          fontWeight={500}>
          {meta.label}
        </Badge>
      );
    },
  },
  {
    id: "review",
    header: "Review",
    cell: ({ row }) => {
      const { status, reviewReason } = row.original;
      if (status === "PENDING") {
        return (
          <Text fontSize="sm" color="textMuted">
            Awaiting Review
          </Text>
        );
      }

      return reviewReason ? (
        <Tooltip label={reviewReason} placement="top" hasArrow>
          <Text
            fontSize="sm"
            maxW="220px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {reviewReason}
          </Text>
        </Tooltip>
      ) : (
        <Text fontSize="sm" color="textMuted">
          No review note
        </Text>
      );
    },
  },
  {
    id: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const { status, createdAt, reviewedAt } = row.original;
      const date = status === "PENDING" ? createdAt : reviewedAt || createdAt;
      const label = status === "PENDING" ? "Requested" : "Reviewed";
      return (
        <Tooltip label={format(new Date(date), "dd MMM yyyy, HH:mm")}>
          <Box>
            <Text fontSize="sm" fontWeight="500">
              {format(new Date(date), "dd MMM yyyy")}
            </Text>

            <Text fontSize="xs" color="textSecondary">
              {label}
            </Text>
          </Box>
        </Tooltip>
      );
    },
  },
];

export const ApprovalsTable = ({
  requests,
  pagination,
  isLoading,
  status,
  onStatusChange,
  onPageChange,
  onItemsPerPageChange,
  onMouseEnter,
}: ApprovalsTableProps) => {
  const [openModal, setOpenModal] = useState<{
    requestId: string;
    reviewAction: ReviewAction | null;
    requestAction: ApprovalAction | null;
    targetUserName: string;
  }>({
    requestId: "",
    reviewAction: null,
    requestAction: null,
    targetUserName: "",
  });
  const tableActions = useMemo(() => {
    if (status !== "PENDING") return [];

    return [
      {
        label: "Approve",
        onClick: (row: Row<ApprovalRequest>) =>
          setOpenModal({
            requestId: row.original.requestId,
            reviewAction: "APPROVED",
            requestAction: row.original.action,
            targetUserName: row.original.targetUser.name,
          }),
      },
      {
        label: "Reject",
        onClick: (row: Row<ApprovalRequest>) =>
          setOpenModal({
            requestId: row.original.requestId,
            reviewAction: "REJECTED",
            requestAction: row.original.action,
            targetUserName: row.original.targetUser.name,
          }),
      },
    ];
  }, [status]);

  return (
    <Box>
      <HStack spacing={2} mb={4}>
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          return (
            <Button
              key={tab.value}
              size="sm"
              h="36px"
              px="16px"
              fontSize="13px"
              fontWeight={isActive ? 600 : 400}
              borderRadius="10px"
              bg={isActive ? "brand.500" : "bgLayer2"}
              color={isActive ? "white" : "textSecondary"}
              border="1px solid"
              borderColor={isActive ? "brand.500" : "borderStructural"}
              _hover={{
                bg: isActive ? "brand.600" : "whiteAlpha.100",
                color: isActive ? "white" : "textPrimary",
              }}
              onClick={() => onStatusChange(tab.value)}>
              {tab.label}
            </Button>
          );
        })}
      </HStack>

      <DataTable<ApprovalRequest>
        data={requests}
        columns={approvalColumns}
        fetchLoading={isLoading}
        getRowId={(row) => row.requestId}
        isInternalPagination
        {...(tableActions.length > 0 && {
          tableAction: { actions: tableActions },
        })}
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

      {!!openModal.requestId && !!openModal.requestAction && (
        <ApprovalActionModal
          isOpen={!!openModal.reviewAction && !!openModal.requestId}
          onClose={() =>
            setOpenModal({
              requestId: "",
              reviewAction: null,
              requestAction: null,
              targetUserName: "",
            })
          }
          reviewAction={openModal.reviewAction!}
          requestedAction={openModal.requestAction!}
          targetUserName={openModal.targetUserName}
          requestId={openModal.requestId}
        />
      )}
    </Box>
  );
};
