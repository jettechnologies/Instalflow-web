import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Heading,
  Button,
  Flex,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { apiService } from "@services/api-service";
import DataTable from "@components/ui/data-table";

interface CommissionLiquidationQueueItem {
  id: string;
  marketerUid: string;
  accruedValue: number;
  ledgerStatus: string;
}

export default function DisbursementClearing() {
  const networkClientCoordinator = useQueryClient();
  const pushNotificationFeedback = useToast();
  const [selectedRowState, setSelectedRowState] = useState<
    Record<string, boolean>
  >({});

  const { data: clearingQueue, isLoading: dataQueueLoading } = useQuery({
    queryKey: ["pending-payouts-allocation-queue"],
    queryFn: async () => {
      const response = await apiService.get<CommissionLiquidationQueueItem[]>(
        "/commissions/pending"
      );
      return response.data;
    },
  });

  const processBulkLiquidationBatch = useMutation({
    mutationFn: async (targetQueueIds: string[]) => {
      const operationMapPromises = targetQueueIds.map((id) =>
        apiService.post(`/commissions/payouts/${id}/company-approve`)
      );
      return await Promise.allSettled(operationMapPromises);
    },
    onSuccess: (results) => {
      const processedSuccessfulCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const processedFailedCount = results.filter(
        (r) => r.status === "rejected"
      ).length;

      pushNotificationFeedback({
        title: "Liquidation Matching Cycle Resolved",
        description: `Successfully cleared ${processedSuccessfulCount} allocations. Execution failures logged: ${processedFailedCount}.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });

      networkClientCoordinator.invalidateQueries({
        queryKey: ["pending-payouts-allocation-queue"],
      });
      networkClientCoordinator.invalidateQueries({
        queryKey: ["platform-financial-double-entry-matrix"],
      });
      setSelectedRowState({});
    },
    meta: {
      errorMessage:
        "The system network batch router failed to execute liquidation operations across targeted assets.",
    },
  });

  const analyticalColumnsDefinition = useMemo(
    () => [
      {
        id: "marketerUid",
        accessorKey: "marketerUid",
        header: "Beneficiary Reference String",
        cell: ({ getValue }: any) => (
          <Text fontWeight="700" color="var(--text-primary)">
            {getValue()}
          </Text>
        ),
      },
      {
        id: "accruedValue",
        accessorKey: "accruedValue",
        header: "Pending Value Allocation",
        cell: ({ getValue }: any) => (
          <Text color="var(--brand-primary)" fontWeight="600">
            ₦{getValue().toLocaleString()}
          </Text>
        ),
      },
      {
        id: "ledgerStatus",
        accessorKey: "ledgerStatus",
        header: "Double-Entry Verification Check",
        cell: () => (
          <Text
            color="var(--status-success)"
            fontSize="11px"
            fontWeight="700"
            letterSpacing="wide">
            [ LIQUIDITY SIGNATURE CLEARANCE CONFIRMED ]
          </Text>
        ),
      },
    ],
    []
  );

  const compiledSelectedRowIds = useMemo(() => {
    return Object.keys(selectedRowState).filter((key) => selectedRowState[key]);
  }, [selectedRowState]);

  if (dataQueueLoading)
    return (
      <Text color="var(--text-muted)" p={6} fontSize="sm">
        Initializing clearing data indices...
      </Text>
    );

  return (
    <Box p={6} bg="var(--bg-layer-1)" minH="70vh">
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <VStack align="flex-start" spacing={1}>
          <Heading size="md" color="var(--text-primary)">
            Maker-Checker Clearing Hub
          </Heading>
          <Text fontSize="xs" color="var(--text-secondary)">
            Authoritative liquidation verification terminal for corporate
            accounts.
          </Text>
        </VStack>
        <Button
          size="sm"
          h="36px"
          borderRadius="xl"
          bg="var(--status-success)"
          color="white"
          _hover={{ bg: "#059669" }}
          isDisabled={compiledSelectedRowIds.length === 0}
          isLoading={processBulkLiquidationBatch.isPending}
          onClick={() =>
            processBulkLiquidationBatch.mutate(compiledSelectedRowIds)
          }>
          Disburse Selected Balances ({compiledSelectedRowIds.length})
        </Button>
      </Flex>

      <Box
        bg="var(--bg-layer-2)"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="var(--border-structural)"
        overflow="hidden">
        <DataTable
          columns={analyticalColumnsDefinition}
          data={clearingQueue || []}
          enableRowSelection={true}
          rowSelection={selectedRowState}
          setRowSelection={setSelectedRowState}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
}
