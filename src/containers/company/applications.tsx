import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Search, Users as UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { getAllKycApplicationsQueryOptions } from "@services/tanstack-queries/kyc";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { type ApplicationsSearchType } from "@utils/schema";
import type { KycApplication, KycStatus } from "@utils/types/response-type";
import { formatCurrency } from "@utils/misc";
import { useNavigate } from "@tanstack/react-router";
import { CompanyApplicationsTable } from "@components/tables/company/applications-table";
import { slugify } from "@utils/misc";
import { OptionalSelectField, type Option } from "@components/forms/select";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";

const STATUS_LABEL: Record<KycStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

interface CompanyApplicationsProps {
  searchParams: ApplicationsSearchType;
}

export function CompanyApplications({
  searchParams,
}: CompanyApplicationsProps) {
  const navigate = useNavigate();
  const updateSearchParam = useUpdateSearchParam<ApplicationsSearchType>();
  const [q, setQ] = useState(searchParams.search || "");

  const { data, isLoading } = useQuery({
    ...getAllKycApplicationsQueryOptions({
      page: searchParams.page,
      limit: searchParams.limit,
      sortOrder: (searchParams.sortOrder as "asc" | "desc") || "desc",
      status: searchParams.status as KycStatus | undefined,
    }),
    select: (data) => data,
  });

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  const { prefetch } = usePrefetchQueryData(getAllKycApplicationsQueryOptions);

  const summary = useMemo(() => {
    return {
      pending: applications.filter((a) => a.status === "PENDING").length,
      halfSigned: applications.filter(
        (a) => a.status === "PENDING" && (a.marketerApproved || a.adminApproved)
      ).length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      exposure: applications
        .filter(
          (a) =>
            a.status === "APPROVED" ||
            (a.status === "PENDING" && a.adminApproved)
        )
        .reduce((s, a) => {
          const price = Number(a.financingContract?.totalFinanced || 0);
          return s + price;
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
      to: "/company/applications/$applicationId/$application-name",
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
      title="KYC applications"
      subtitle=" Maker-checker approval: both the referring marketer and an admin must sign off before a contract activates.">
      <VStack align="stretch" spacing={6}>
        <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
          {[
            { label: "Pending review", value: String(summary.pending) },
            { label: "Half-signed", value: String(summary.halfSigned) },
            { label: "Approved", value: String(summary.approved) },
            {
              label: "Pipeline exposure",
              value: formatCurrency(summary.exposure),
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
              {applications.length} of {applications.length ?? 0}
            </Text>
          </Flex>

          {!isLoading && applications.length === 0 ? (
            <VStack py={16} spacing={3}>
              <UsersIcon size={32} color="#475467" />
              <Text fontSize="13px" color="textSecondary">
                No applications match your filters.
              </Text>
            </VStack>
          ) : (
            <CompanyApplicationsTable
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
