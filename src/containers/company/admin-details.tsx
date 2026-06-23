import {
  getAdminDetailQueryOptions,
  getMarketersCreatedByAdminQueryOptions,
} from "@services/tanstack-queries/staff-management";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Layers,
  Trash2,
  ToggleLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { tokens } from "@theme";
import { formatCurrency, formatDate } from "@utils/misc";
import type {
  DetailedAdminResponse,
  UserActions,
} from "@utils/types/response-type";
import { MarketerDetailsStatCard } from "@components/company/marketers/marketers-details";
import type { OverviewSearchType } from "@utils/schema";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";
import { MarketersTable } from "@components/tables/company/marketers-table";
import { LIMIT } from "@services/api-service";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { useState } from "react";
import { AdminActionModal } from "@layouts/modal-layout/admin-action";

interface AdminDetailsProps {
  adminId: string;
  params: OverviewSearchType;
}

const getStats = (admin: DetailedAdminResponse) => [
  {
    label: "Created Marketers",
    value: admin.stats.marketerCount ?? admin.createdUsers.length,
    icon: Users,
    accentColor: tokens.brand.primary,
  },
  {
    label: "Total Referred Customers",
    value: admin.stats.customerCount ?? "—",
    icon: FileText,
    accentColor: tokens.status.info,
  },
  {
    label: "Total Financed Volume",
    value: formatCurrency(admin.stats.financingContractCount ?? 0),
    icon: TrendingUp,
    accentColor: tokens.brand.primary,
  },
  {
    label: "Commission Generated",
    value: formatCurrency(admin.stats.totalCommissionGenerated ?? 0),
    icon: DollarSign,
    accentColor: tokens.status.success,
  },
  {
    label: "Commission Records",
    value: admin.stats.totalCommissionRecords ?? "—",
    icon: Layers,
    accentColor: tokens.text.muted,
  },
  //   {
  //     label: "Total Payout Requested",
  //     value: formatCurrency(admin.stats.totalPayoutRequested ?? 0),
  //     icon: ArrowUpRight,
  //     accentColor: tokens.status.warning,
  //   },
  //   {
  //     label: "Payout Requests",
  //     value: admin.stats.totalPayoutRequests ?? "—",
  //     icon: List,
  //     accentColor: tokens.status.info,
  //   },
  //   {
  //     label: "Total Finaced Volume",
  //     value: admin.stats.totalFinancedVolume ?? "—",
  //     icon: List,
  //     accentColor: tokens.status.info,
  //   },
];

export const AdminDetails = ({ adminId, params }: AdminDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [action, setAction] = useState<UserActions | null>(null);
  const {
    isOpen: modalIsOpen,
    onClose: modalOnClose,
    onOpen: modalOnOpen,
  } = useDisclosure();

  const onToggle = () => setIsOpen((prev) => !prev);

  const updateSearchParam = useUpdateSearchParam<OverviewSearchType>();

  const { data: admin } = useSuspenseQuery({
    ...getAdminDetailQueryOptions(adminId),
    select: (data) => data.data,
  });

  const { data: adminCreatedMarketers } = useSuspenseQuery({
    ...getMarketersCreatedByAdminQueryOptions({ adminId, params }),
    select: (data) => data.data,
  });

  const marketers = adminCreatedMarketers?.marketers || [];
  const pagination = adminCreatedMarketers?.pagination;
  const { prefetch } = usePrefetchQueryData(
    getMarketersCreatedByAdminQueryOptions
  );

  const onPageChange = (page: number) =>
    updateSearchParam("page", page.toString());

  const onItemsPerPageChange = (size: number) =>
    updateSearchParam("limit", size.toString());

  const onPrefetch = () =>
    prefetch({
      adminId,
      params: {
        ...params,
        page: String((pagination?.currentPage || 1) + 1),
      },
    });

  const stats = getStats(admin);

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
            <HStack spacing={4} align="flex-start">
              <Avatar
                name={admin.name}
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
                    {admin.name}
                  </Heading>
                  {/* Active pill */}
                  <Box
                    px={2}
                    py={0.5}
                    borderRadius="6px"
                    bg={
                      admin.active
                        ? "rgba(16,185,129,0.12)"
                        : "rgba(107,114,128,0.18)"
                    }
                    border="1px solid"
                    borderColor={
                      admin.active
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(107,114,128,0.3)"
                    }>
                    <HStack spacing={1.5}>
                      <Box
                        w={1.5}
                        h={1.5}
                        borderRadius="full"
                        bg={admin.active ? "statusSuccess" : "textMuted"}
                      />
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color={admin.active ? "statusSuccess" : "textMuted"}
                        letterSpacing="0.06em">
                        {admin.active ? "ACTIVE" : "INACTIVE"}
                      </Text>
                    </HStack>
                  </Box>
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
                      {admin.role}
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize="13px" color="textSecondary">
                  {admin.email}
                </Text>
                <Text fontSize="12px" color="textMuted">
                  {admin.createdUsers.length} marketer
                  {admin.createdUsers.length !== 1 ? "s" : ""} created
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={2} flexShrink={0} flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Icon as={ToggleLeft} boxSize={4} />}
                borderColor={
                  admin.active ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"
                }
                color={admin.active ? "statusDanger" : "statusSuccess"}
                bg={
                  admin.active
                    ? "rgba(239,68,68,0.06)"
                    : "rgba(16,185,129,0.06)"
                }
                _hover={{
                  bg: admin.active
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(16,185,129,0.12)",
                  borderColor: admin.active
                    ? "rgba(239,68,68,0.6)"
                    : "rgba(16,185,129,0.6)",
                }}
                onClick={() => {
                  setAction("TOGGLE_STATUS");
                  modalOnOpen();
                }}>
                {admin.active ? "Deactivate Admin" : "Activate Admin"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Icon as={Trash2} boxSize={4} />}
                borderColor="rgba(239,68,68,0.4)"
                color="statusDanger"
                bg="rgba(239,68,68,0.06)"
                _hover={{
                  bg: "rgba(239,68,68,0.12)",
                  borderColor: "rgba(239,68,68,0.6)",
                }}
                onClick={() => {
                  setAction("DELETE_ACCOUNT");
                  modalOnOpen();
                }}>
                Delete Admin
              </Button>
            </HStack>
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
                {formatDate(admin.createdAt)}
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
                {formatDate(admin.updatedAt)}
              </Text>
            </VStack>
            <VStack align="flex-start" spacing={0.5}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.06em">
                User ID
              </Text>
              <Text
                fontSize="13px"
                color="textSecondary"
                fontFamily="mono"
                letterSpacing="0.02em">
                {admin.userId}
              </Text>
            </VStack>
          </Flex>
        </Box>

        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={4}
          mb={5}>
          {stats.map((s) => (
            <MarketerDetailsStatCard key={s.label} {...s} />
          ))}
        </Grid>

        <Box
          bg={tokens.bg.layer2}
          border="1px solid"
          borderColor={tokens.border.structural}
          borderRadius="12px"
          overflow="hidden">
          <Flex
            as="button"
            w="100%"
            px={5}
            py={4}
            align="center"
            justify="space-between"
            borderBottom={isOpen ? "1px solid" : "none"}
            borderColor={tokens.border.structural}
            onClick={onToggle}
            cursor="pointer"
            transition="background 0.15s ease"
            _hover={{ bg: `${tokens.border.structural}60` }}>
            <HStack spacing={3}>
              <Box
                p={1.5}
                borderRadius="7px"
                bg={`${tokens.brand.primary}15`}
                border="1px solid"
                borderColor={`${tokens.brand.primary}30`}>
                <Icon as={Users} boxSize={3.5} color={tokens.brand.primary} />
              </Box>
              <Text
                fontSize="13px"
                fontWeight={600}
                color={tokens.text.secondary}
                letterSpacing="0.06em"
                textTransform="uppercase">
                Created Marketers
              </Text>
              <Box
                px={2}
                py={0.5}
                borderRadius="6px"
                bg={`${tokens.brand.primary}15`}
                border="1px solid"
                borderColor={`${tokens.brand.primary}30`}>
                <Text
                  fontSize="11px"
                  fontWeight={700}
                  color={tokens.brand.primary}
                  letterSpacing="0.04em">
                  {pagination.total}
                </Text>
              </Box>
            </HStack>

            <Icon
              as={isOpen ? ChevronUp : ChevronDown}
              boxSize={4}
              color={tokens.text.muted}
              transition="transform 0.2s ease"
            />
          </Flex>

          <Collapse in={isOpen} animateOpacity>
            {marketers.length === 0 ? (
              <Flex
                py={10}
                justify="center"
                align="center"
                direction="column"
                gap={2}>
                <Icon as={Users} boxSize={6} color={tokens.text.muted} />
                <Text fontSize="13px" color={tokens.text.muted}>
                  No marketers created by this admin yet
                </Text>
              </Flex>
            ) : (
              <MarketersTable
                marketers={marketers}
                page={pagination?.currentPage || 1}
                limit={pagination?.limit || Number(LIMIT)}
                totalCount={pagination?.total || 10}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
                onMouseEnter={onPrefetch}
              />
            )}
          </Collapse>
        </Box>
      </Box>
      <AdminActionModal
        isOpen={modalIsOpen}
        onClose={modalOnClose}
        adminId={adminId}
        adminName={admin.name}
        active={admin.active}
        action={action ?? "TOGGLE_STATUS"}
      />
    </Box>
  );
};
