import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MarketersTable } from "@components/tables/company/marketers-table";
import { useAuth } from "@context/auth-provider";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";
import { InviteMarketer } from "@layouts/modal-layout/invite-marketer";
import { UserPlusIcon } from "@phosphor-icons/react";
import { LIMIT } from "@services/api-service";
import { getAllMarketersQueryOptions } from "@services/tanstack-queries/staff-management";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { OverviewSearchType } from "@utils/schema";
import type { UserRole } from "@utils/types";
import { FileText } from "lucide-react";

interface MarketerOverviewProps {
  search: OverviewSearchType;
}

export const MarketerOverview = ({ search }: MarketerOverviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const userRole = user?.role as UserRole;
  const updateSearchParam = useUpdateSearchParam<OverviewSearchType>();

  const navigate = useNavigate();

  const { data: marketersResponse, isLoading } = useQuery({
    ...getAllMarketersQueryOptions(search),
    select: (data) => data.data,
  });

  const { prefetch } = usePrefetchQueryData(getAllMarketersQueryOptions);

  const marketers = marketersResponse?.marketers || [];
  const pagination = marketersResponse?.pagination;

  const onPageChange = (page: number) =>
    updateSearchParam("page", page.toString());

  const onItemsPerPageChange = (size: number) =>
    updateSearchParam("limit", size.toString());

  const onPrefetch = () =>
    prefetch({ ...search, page: String((pagination?.currentPage || 1) + 1) });

  return (
    <>
      <VStack align="stretch" spacing={6}>
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={4}
          direction={{ base: "column", md: "row" }}>
          <Box>
            <Heading size="lg">Marketers network</Heading>
            <Text fontSize="13px" color="textSecondary" mt={1}>
              Invite field agents, configure commissions, and manage access.
            </Text>
          </Box>

          <HStack spacing={4}>
            {userRole === "COMPANY" && (
              <Button
                leftIcon={<FileText size={16} />}
                onClick={() => {
                  navigate({
                    to: "/company/approvals",
                    search: {
                      status: "PENDING",
                    },
                  });
                }}>
                Pending Approvals
              </Button>
            )}

            <Button leftIcon={<UserPlusIcon size={16} />} onClick={onOpen}>
              Invite marketer
            </Button>
          </HStack>
        </Flex>

        {/* <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
        {[
          { label: "Active marketers", value: String(summary.active) },
          { label: "Pending invites", value: String(summary.pending) },
          { label: "Total referrals", value: String(summary.referrals) },
          { label: "Payable commissions", value: ngn(summary.payable) },
        ].map((s) => (
          <Box
            key={s.label}
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              {s.label.toUpperCase()}
            </Text>
            <Text
              fontSize="24px"
              fontWeight={800}
              mt={2}
              letterSpacing="-0.02em">
              {s.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid> */}

        <Box
          bg="bgLayer2"
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="2xl"
          overflow="hidden">
          <Flex
            px={5}
            py={4}
            gap={3}
            borderBottom="1px solid"
            borderColor="borderStructural"
            align="center"
            direction={{ base: "column", md: "row" }}>
            {/* <InputGroup maxW={{ md: "320px" }}>
            <InputLeftElement pointerEvents="none" h="40px">
              <FileSearchIcon size={14} color="#667185" />
            </InputLeftElement>
            <Input
              placeholder="Search name, email, phone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="md"
              h="40px"
            />
          </InputGroup> */}
            {/* <Select
            maxW={{ md: "180px" }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as MarketerStatus | "")
            }
            bg="bgLayer1"
            borderColor="borderStructural"
            h="40px">
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INVITED">Invited</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
          <Box flex={1} />
          <Text fontSize="12px" color="textMuted">
            {filtered.length} of {marketers?.length ?? 0}
          </Text> */}
          </Flex>

          <MarketersTable
            marketers={marketers}
            isLoading={isLoading}
            page={pagination?.currentPage || 1}
            limit={pagination?.limit || Number(LIMIT)}
            totalCount={pagination?.total || 10}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            onMouseEnter={onPrefetch}
          />
        </Box>
      </VStack>
      <InviteMarketer isOpen={isOpen} onClose={onClose} />
    </>
  );
};
