import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Search, Users as UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { getAllKycApplicationsQueryOptions } from "@services/tanstack-queries/kyc";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { type ApplicationsSearchType } from "@utils/schema";
import type { KycApplication, KycStatus } from "@utils/types/response-type";
import { formatCurrency, slugify } from "@utils/misc";
import { useNavigate } from "@tanstack/react-router";
import { MarketerApplicationsTable } from "@components/tables/marketer/applications-table";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";
import { OptionalSelectField, type Option } from "@components/forms/select";

const STATUS_LABEL: Record<KycStatus, string> = {
  PENDING: "Pending",
  APPROVAL_PROCESSING: "Approval Processing",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

interface MarketerApplicationsProps {
  searchParams: ApplicationsSearchType;
}

export function MarketerApplications({
  searchParams,
}: MarketerApplicationsProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState(searchParams.search || "");

  const updateSearchParam = useUpdateSearchParam<ApplicationsSearchType>();

  const { data, isLoading } = useQuery({
    ...getAllKycApplicationsQueryOptions(searchParams),
    select: (data) => data,
  });

  const { prefetch } = usePrefetchQueryData(getAllKycApplicationsQueryOptions);

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  const summary = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "PENDING").length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      expectedCommission: applications
        .filter(
          (a) =>
            a.status === "APPROVED" ||
            (a.status === "PENDING" && a.adminApproved)
        )
        .reduce((s, a) => {
          const price = Number(a.financingContract?.totalFinanced || 0);
          return s + Math.round((price * 0.05) / 100) * 100;
        }, 0),
    };
  }, [applications]);

  const onPageChange = (page: number) =>
    updateSearchParam("page", page.toString());

  const onItemsPerPageChange = (limit: number) => {
    updateSearchParam("limit", limit.toString());
    updateSearchParam("page", "1");
  };

  const handleRowClick = (application: KycApplication) => {
    navigate({
      to: "/marketer/applications/$applicationId/$application-name",
      params: {
        applicationId: application.kycApplicationId,
        "application-name": slugify(
          application.user?.name || application.onboardingSession.name
        ),
      },
    });
  };

  const onPrefetch = () =>
    prefetch({
      ...searchParams,
      page: String((pagination?.currentPage || 1) + 1),
    });

  return (
    <AppShell
      title="Customer applications"
      subtitle="
       Track every application submitted through your referral links — and
            sign your marketer approval to advance the maker-checker queue.
    ">
      <VStack align="stretch" spacing={6}>
        <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
          {[
            { label: "Total submissions", value: String(summary.total) },
            { label: "In review", value: String(summary.pending) },
            { label: "Approved", value: String(summary.approved) },
            {
              label: "Expected commission",
              value: formatCurrency(summary.expectedCommission),
            },
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
        </SimpleGrid>

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
            <InputGroup maxW={{ md: "320px" }}>
              <InputLeftElement pointerEvents="none" h="40px">
                <Search size={14} color="#667185" />
              </InputLeftElement>
              <Input
                placeholder="Search customer, product…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                h="40px"
              />
            </InputGroup>
            <OptionalSelectField
              width="200px"
              height="40px"
              defaultValue={searchParams.status ?? ""}
              options={[
                { value: "", label: "All statuses" },
                ...(Object.keys(STATUS_LABEL) as KycStatus[]).map((status) => ({
                  value: status,
                  label: STATUS_LABEL[status],
                })),
              ]}
              onChange={(option) => {
                const status = (
                  (option as Option).value === ""
                    ? undefined
                    : (option as Option).value
                ) as KycStatus | undefined;
                updateSearchParam("status", status);
              }}
            />
            <Box flex={1} />
            <Text fontSize="12px" color="textMuted">
              {applications.length} applications
            </Text>
          </Flex>
          {!isLoading && applications.length === 0 ? (
            <VStack py={16} spacing={3}>
              <UsersIcon size={32} color="#475467" />
              <Text fontSize="13px" color="textSecondary">
                No applications yet — share a referral link to start.
              </Text>
            </VStack>
          ) : (
            <MarketerApplicationsTable
              applications={applications}
              pagination={pagination!}
              isLoading={isLoading}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
              onRowClick={handleRowClick}
              onMouseEnter={onPrefetch}
            />
          )}
        </Box>
      </VStack>
    </AppShell>
  );
}
