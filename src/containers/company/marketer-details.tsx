import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getMarketerDetailQueryOptions } from "@services/tanstack-queries/staff-management";
import { useSuspenseQuery } from "@tanstack/react-query";
import type {
  DetailedMarketerResponse,
  RecentCustomer,
  RecentPayoutRequest,
} from "@utils/types/response-type";
import {
  Users,
  CheckCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowUpRight,
  List,
  // ChevronDown,
  ToggleLeft,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { useMemo } from "react";
import { tokens } from "@theme";
import {
  CopyChip,
  MarketerDetailsBankCard,
  MarketerDetailsEmpty,
  MarketerDetailsSection,
  MarketerDetailsStatCard,
  StatusPill,
} from "@components/company/marketers/marketers-details";
import { useAuth } from "@context/auth-provider";
import { formatCurrency, formatDate } from "@utils/misc";

interface MarketerDetailProps {
  marketerId: string;
}

const getStats = (m: DetailedMarketerResponse) => [
  {
    label: "Referred Customers",
    value: m.stats.referredCustomers,
    icon: Users,
    accentColor: tokens.brand.primary,
  },
  {
    label: "Approved KYC Applications",
    value: m.stats.approvedKycApplications,
    icon: CheckCircle,
    accentColor: tokens.status.success,
  },
  {
    label: "Financing Contracts",
    value: m.stats.financingContracts,
    icon: FileText,
    accentColor: tokens.status.info,
  },
  {
    label: "Total Financed Volume",
    value: formatCurrency(m.stats.totalFinancedVolume),
    icon: TrendingUp,
    accentColor: tokens.brand.primary,
  },
  {
    label: "Commission Generated",
    value: formatCurrency(m.stats.totalCommissionGenerated),
    icon: DollarSign,
    accentColor: tokens.status.success,
  },
  {
    label: "Commission Records",
    value: m.stats.totalCommissionRecords,
    icon: Layers,
    accentColor: tokens.text.muted,
  },
  {
    label: "Total Payout Requested",
    value: formatCurrency(m.stats.totalPayoutRequested),
    icon: ArrowUpRight,
    accentColor: tokens.status.warning,
  },
  {
    label: "Payout Requests",
    value: m.stats.totalPayoutRequests,
    icon: List,
    accentColor: tokens.status.info,
  },
];

export const MarketerDetail = ({ marketerId }: MarketerDetailProps) => {
  const { data: m } = useSuspenseQuery({
    ...getMarketerDetailQueryOptions(marketerId),
    select: (data) => data.data,
  });

  const { user } = useAuth();

  const userRole = user?.role;

  const actions = useMemo(
    () =>
      userRole === "COMPANY"
        ? [
            {
              label: m.active ? "Deactivate Marketer" : "Activate Marketer",
              onClick: () => console.log("toggle status", marketerId),
              icon: ToggleLeft,
              colorScheme: m.active ? "red" : "green",
            },
            {
              label: "Delete Marketer",
              onClick: () => console.log("Delete Marketer", marketerId),
              icon: Trash2,
              colorScheme: "red",
            },
          ]
        : userRole === "ADMIN"
          ? [
              {
                label: "Request Toggle Status",
                onClick: () => console.log("request toggle status", marketerId),
                icon: ClipboardCheck,
                colorScheme: "yellow",
              },
              {
                label: "Request Delete Marketer",
                onClick: () =>
                  console.log("Request Delete Marketer", marketerId),
                icon: ClipboardCheck,
                colorScheme: "yellow",
              },
            ]
          : [],
    [userRole]
  );

  const stats = getStats(m);

  return (
    <Box minH="100vh" bg="bgLayer1" p={{ base: 4, md: 6 }}>
      <Box mx="auto">
        <Box
          bg="bgLayer2"
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="12px"
          p={{ base: 5, md: 6 }}
          mb={5}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={4}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}>
            {/* left — avatar + info */}
            <HStack spacing={4} align="flex-start">
              <Avatar
                name={m.name}
                size="lg"
                bg="brand.500"
                color="white"
                fontWeight={700}
              />
              <VStack align="flex-start" spacing={1.5}>
                <HStack spacing={2} flexWrap="wrap">
                  <Heading
                    fontSize="20px"
                    color="textPrimary"
                    fontWeight={600}
                    letterSpacing="-0.01em">
                    {m.name}
                  </Heading>
                  <Box
                    px={2}
                    py={0.5}
                    borderRadius="6px"
                    bg={
                      m.active
                        ? "rgba(16,185,129,0.12)"
                        : "rgba(107,114,128,0.18)"
                    }
                    border="1px solid"
                    borderColor={
                      m.active
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(107,114,128,0.3)"
                    }>
                    <HStack spacing={1.5}>
                      <Box
                        w={1.5}
                        h={1.5}
                        borderRadius="full"
                        bg={m.active ? "statusSuccess" : "textMuted"}
                      />
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color={m.active ? "statusSuccess" : "textMuted"}
                        letterSpacing="0.06em">
                        {m.active ? "ACTIVE" : "INACTIVE"}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <Text fontSize="13px" color="textSecondary">
                  {m.email}
                </Text>
                <HStack spacing={3} flexWrap="wrap">
                  <CopyChip value={m.referralCode} />
                  <Text fontSize="12px" color="textMuted">
                    {m._count.referredUsers} referral
                    {m._count.referredUsers !== 1 ? "s" : ""}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {actions.length > 0 && (
              <Flex gap={3} wrap="wrap">
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant="ghostOutline"
                    onClick={action.onClick}
                    leftIcon={<Icon as={action.icon} boxSize={4} />}
                    color={
                      action.colorScheme === "red"
                        ? "statusDanger"
                        : action.colorScheme === "yellow"
                          ? "statusWarning"
                          : "statusSuccess"
                    }
                    borderColor={
                      action.colorScheme === "red"
                        ? "statusDanger"
                        : action.colorScheme === "yellow"
                          ? "statusWarning"
                          : "statusSuccess"
                    }
                    _hover={{
                      bg:
                        action.colorScheme === "red"
                          ? "rgba(239,68,68,0.08)"
                          : action.colorScheme === "yellow"
                            ? "rgba(245,158,11,0.08)"
                            : "rgba(34,197,94,0.08)",
                    }}>
                    {action.label}
                  </Button>
                ))}
              </Flex>
            )}
          </Flex>

          <Divider borderColor="borderStructural" my={4} />
          <Flex gap={6} flexWrap="wrap">
            <VStack align="flex-start" spacing={0.5}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.06em">
                Joined
              </Text>
              <Text fontSize="13px" color="textSecondary">
                {formatDate(m.createdAt)}
              </Text>
            </VStack>
            <VStack align="flex-start" spacing={0.5}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.06em">
                Last Updated
              </Text>
              <Text fontSize="13px" color="textSecondary">
                {formatDate(m.updatedAt)}
              </Text>
            </VStack>
            <VStack align="flex-start" spacing={0.5}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.06em">
                Created By
              </Text>
              <HStack spacing={1.5}>
                <Text fontSize="13px" color="textSecondary">
                  {m.creator.name}
                </Text>
                <Box
                  px={1.5}
                  py={0.5}
                  borderRadius="4px"
                  bg="brand.200"
                  border="1px solid"
                  borderColor="brand.600">
                  <Text
                    fontSize="10px"
                    fontWeight={700}
                    color="brand.400"
                    letterSpacing="0.05em">
                    {m.creator.role}
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={4}
          mb={5}>
          {stats.map((s) => (
            <MarketerDetailsStatCard key={s.label} {...s} />
          ))}
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5} mb={5}>
          <MarketerDetailsSection title="Bank Accounts">
            {m.marketerBankAccounts.length === 0 ? (
              <MarketerDetailsEmpty label="No bank accounts added" />
            ) : (
              <Box p={4}>
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={3}>
                  {m.marketerBankAccounts.map((acct) => (
                    <MarketerDetailsBankCard
                      key={acct.accountId}
                      account={acct}
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </MarketerDetailsSection>

          <MarketerDetailsSection title="Recent Payout Requests">
            {m.recentPayoutRequests.length === 0 ? (
              <MarketerDetailsEmpty label="No payout requests yet" />
            ) : (
              <Box overflowX="auto">
                <Box as="table" w="100%" style={{ borderCollapse: "collapse" }}>
                  <Box as="thead">
                    <Box
                      as="tr"
                      borderBottom="1px solid"
                      borderColor="borderStructural">
                      {["Amount", "Status", "Requested"].map((h) => (
                        <Box
                          key={h}
                          as="th"
                          px={5}
                          py={3}
                          textAlign="left"
                          fontSize="11px"
                          fontWeight={600}
                          color="textMuted"
                          letterSpacing="0.06em"
                          textTransform="uppercase"
                          whiteSpace="nowrap">
                          {h}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box as="tbody">
                    {m.recentPayoutRequests.map(
                      (req: RecentPayoutRequest, i) => (
                        <Box
                          key={req.payoutId}
                          as="tr"
                          borderBottom={
                            i < m.recentPayoutRequests.length - 1
                              ? "1px solid"
                              : "none"
                          }
                          borderColor="borderStructural"
                          _hover={{ bg: `${tokens.border.structural}60` }}
                          transition="background 0.1s">
                          <Box as="td" px={5} py={3.5}>
                            <Text
                              fontSize="14px"
                              fontWeight={600}
                              color="textPrimary"
                              fontFamily="mono">
                              {formatCurrency(req.amount)}
                            </Text>
                          </Box>
                          <Box as="td" px={5} py={3.5}>
                            <StatusPill status={req.status} />
                          </Box>
                          <Box as="td" px={5} py={3.5} whiteSpace="nowrap">
                            <Text fontSize="13px" color="textSecondary">
                              {formatDate(req.requestedAt)}
                            </Text>
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </MarketerDetailsSection>
        </Grid>

        <MarketerDetailsSection
          title={`Recent Customers (${m.recentCustomers.length})`}>
          {m.recentCustomers.length === 0 ? (
            <MarketerDetailsEmpty label="No customers referred yet" />
          ) : (
            <Box overflowX="auto">
              <Box as="table" w="100%" style={{ borderCollapse: "collapse" }}>
                <Box as="thead">
                  <Box
                    as="tr"
                    borderBottom="1px solid"
                    borderColor="borderStructural">
                    {["Customer", "Email", "Joined"].map((h) => (
                      <Box
                        key={h}
                        as="th"
                        px={5}
                        py={3}
                        textAlign="left"
                        fontSize="11px"
                        fontWeight={600}
                        color="textMuted"
                        letterSpacing="0.06em"
                        textTransform="uppercase"
                        whiteSpace="nowrap">
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  {m.recentCustomers.map((c: RecentCustomer, i) => (
                    <Box
                      key={c.userId}
                      as="tr"
                      borderBottom={
                        i < m.recentCustomers.length - 1 ? "1px solid" : "none"
                      }
                      borderColor="borderStructural"
                      _hover={{ bg: `${tokens.border.structural}60` }}
                      transition="background 0.1s">
                      <Box as="td" px={5} py={3.5}>
                        <HStack spacing={3}>
                          <Avatar
                            name={c.name}
                            size="xs"
                            bg="brand.500"
                            color="white"
                            fontWeight={700}
                          />
                          <Text
                            fontSize="14px"
                            fontWeight={500}
                            color="textPrimary">
                            {c.name}
                          </Text>
                        </HStack>
                      </Box>
                      <Box as="td" px={5} py={3.5}>
                        <Text fontSize="13px" color="textSecondary">
                          {c.email}
                        </Text>
                      </Box>
                      <Box as="td" px={5} py={3.5} whiteSpace="nowrap">
                        <Text fontSize="13px" color="textSecondary">
                          {formatDate(c.createdAt)}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </MarketerDetailsSection>
      </Box>
    </Box>
  );
};
