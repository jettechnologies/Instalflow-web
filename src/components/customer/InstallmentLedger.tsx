import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { useSettleInstallment } from "@services/tanstack-mutations/mutations";
import { getCustomerInstallmentsOptions } from "@services/tanstack-queries/queries";
import { QUERY_KEYS } from "@services/query-keys";

interface AmortizationTermDef {
  id: string;
  dueDate: string;
  amount: number;
  status: "PENDING" | "DUE" | "OVERDUE" | "PAID";
}

export default function InstallmentLedger() {
  const queryClient = useQueryClient();
  const [page] = useState(1);

  const { data: consumerSchedule, isLoading: trackingLoading } = useQuery(
    getCustomerInstallmentsOptions(page)
  );

  const initializeTermLiquidation = useSettleInstallment();

  // Immediately invalidate both related caches after a successful settlement
  const handleSettle = (installmentId: string) => {
    initializeTermLiquidation.mutate(installmentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.installments.customer(page),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ledger.analytics(),
        });
      },
    });
  };

  const computeStatusThematicBadges = (currentStatus: string) => {
    switch (currentStatus) {
      case "PAID":
        return {
          bg: "rgba(16, 185, 129, 0.12)",
          text: "var(--status-success)",
        };
      case "PENDING":
        return { bg: "rgba(6, 182, 212, 0.12)", text: "var(--status-info)" };
      case "DUE":
        return {
          bg: "rgba(245, 158, 11, 0.12)",
          text: "var(--status-warning)",
        };
      default:
        return { bg: "rgba(239, 68, 68, 0.12)", text: "var(--status-danger)" };
    }
  };

  if (trackingLoading) {
    return (
      <Text color="var(--text-muted)" p={6} fontSize="sm">
        Querying historical ledger data streams...
      </Text>
    );
  }

  const schedule = (consumerSchedule ?? []) as AmortizationTermDef[];
  const totalAmount = schedule.reduce((sum, item) => sum + item.amount, 0) || 1;
  const paidAmount = schedule
    .filter((item) => item.status === "PAID")
    .reduce((sum, item) => sum + item.amount, 0);
  const progressPct = Math.round((paidAmount / totalAmount) * 100);

  return (
    <Box p={6} bg="var(--bg-layer-1)" minH="70vh">
      {/* Principal Amortization Summary Block */}
      <Box
        p={6}
        bg="var(--bg-layer-2)"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="var(--border-structural)"
        mb={6}>
        <Heading
          size="xs"
          color="var(--text-secondary)"
          mb={2}
          textTransform="uppercase"
          letterSpacing="wider">
          Active Contract Maturity Progress
        </Heading>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="2xl" fontWeight="800" color="var(--text-primary)">
            ₦{paidAmount.toLocaleString()}.00 / ₦{totalAmount.toLocaleString()}
            .00
          </Text>
          <Text fontSize="xs" color="var(--status-success)" fontWeight="700">
            {progressPct}% Repayment Horizon Reached
          </Text>
        </Flex>
        <Progress
          value={progressPct}
          size="xs"
          borderRadius="full"
          bg="var(--bg-layer-1)"
          sx={{ "& > div": { background: "var(--brand-gradient)" } }}
        />
      </Box>

      <Heading
        size="xs"
        color="var(--text-secondary)"
        mb={4}
        textTransform="uppercase"
        letterSpacing="wider">
        Chronological Ledger Term Layout
      </Heading>

      <VStack spacing={3} align="stretch">
        {schedule.map((term) => {
          const contextStyle = computeStatusThematicBadges(term.status);
          const isSettling =
            initializeTermLiquidation.isPending &&
            initializeTermLiquidation.variables === term.id;

          return (
            <Flex
              key={term.id}
              p={4}
              bg="var(--bg-layer-2)"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="var(--border-structural)"
              justify="space-between"
              align="center">
              <VStack align="flex-start" spacing={1}>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color="var(--text-primary)">
                  ₦{term.amount.toLocaleString()}
                </Text>
                <Text fontSize="11px" color="var(--text-muted)">
                  Maturity Target: {new Date(term.dueDate).toLocaleDateString()}
                </Text>
              </VStack>
              <Flex align="center" gap={4}>
                <Badge
                  bg={contextStyle.bg}
                  color={contextStyle.text}
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="10px"
                  fontWeight="700"
                  variant="subtle">
                  {term.status}
                </Badge>
                {term.status !== "PAID" && (
                  <Button
                    size="xs"
                    h="28px"
                    px={4}
                    borderRadius="lg"
                    bg="var(--brand-primary)"
                    color="var(--text-primary)"
                    _hover={{ opacity: 0.9 }}
                    isLoading={isSettling}
                    onClick={() => handleSettle(term.id)}>
                    Settle Account Term
                  </Button>
                )}
              </Flex>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}
