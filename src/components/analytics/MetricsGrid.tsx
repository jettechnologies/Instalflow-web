import { useQuery } from "@tanstack/react-query";
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { apiService } from "@services/api-service";

interface SystemBalanceAggregations {
  totalRevenue: number;
  netInstallmentRevenue: number;
  commissionsGenerated: number;
  paidCommissions: number;
  activeContracts: number;
  defaultedContracts: number;
}

export default function MetricsGrid() {
  const { data: calculatedAggregations, isLoading: analyticalSyncActive } =
    useQuery({
      queryKey: ["platform-financial-double-entry-matrix"],
      queryFn: async () => {
        const response = await apiService.get<SystemBalanceAggregations>(
          "/analytics/dashboard-summary"
        );
        return response.data;
      },
    });

  if (analyticalSyncActive) {
    return (
      <Text color="var(--text-muted)" p={6} fontSize="sm">
        Running double-entry reconciliation...
      </Text>
    );
  }

  const metrics = [
    {
      label: "Gross Realized Platform Revenue",
      value: calculatedAggregations?.totalRevenue || 0,
      help: "Cumulative platform fee aggregation",
      color: "var(--brand-primary)",
    },
    {
      label: "Net Term Interest Margin",
      value: calculatedAggregations?.netInstallmentRevenue || 0,
      help: "Portfolio yield parameter updates",
      color: "var(--status-info)",
    },
    {
      label: "Commissions Generated",
      value: calculatedAggregations?.commissionsGenerated || 0,
      help: "System-wide commissions ledger volume",
      color: "var(--status-warning)",
    },
    {
      label: "Commissions Disbursed",
      value: calculatedAggregations?.paidCommissions || 0,
      help: "Settled partner accounts",
      color: "var(--status-success)",
    },
  ];

  return (
    <Box p={6} bg="var(--bg-layer-1)" minH="70vh">
      <Heading size="md" mb={2} color="var(--text-primary)" fontWeight="700">
        Core Ledger Financial Reporting
      </Heading>
      <Text fontSize="xs" color="var(--text-secondary)" mb={6}>
        Real-time double-entry calculations derived directly from transactional
        logs.
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={8}>
        {metrics.map((metric, idx) => (
          <Box
            key={idx}
            p={5}
            bg="var(--bg-layer-2)"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="var(--border-structural)">
            <Stat>
              <StatLabel fontSize="xs" color="var(--text-secondary)" mb={2}>
                {metric.label}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="800" color={metric.color}>
                ₦
                {metric.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
              <StatHelpText fontSize="10px" color="var(--text-muted)" mt={1}>
                {metric.help}
              </StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={5}
          bg="var(--bg-layer-2)"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="var(--border-structural)">
          <Heading
            size="xs"
            color="var(--text-primary)"
            mb={3}
            textTransform="uppercase"
            letterSpacing="wider">
            Operational Volatility Metrics
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Flex justify="space-between">
              <Text fontSize="xs" color="var(--text-secondary)">
                Active Financing Contracts
              </Text>
              <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
                {calculatedAggregations?.activeContracts || 0}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="xs" color="var(--text-secondary)">
                Defaulted Risk Horizons
              </Text>
              <Text fontSize="xs" fontWeight="700" color="var(--status-danger)">
                {calculatedAggregations?.defaultedContracts || 0}
              </Text>
            </Flex>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
