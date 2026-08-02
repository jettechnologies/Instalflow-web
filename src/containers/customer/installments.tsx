import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { useInitializeInstallmentPayment } from "@services/tanstack-mutations";
import { getCustomerInstallmentsOptions } from "@services/tanstack-queries";
import { formatCurrency } from "@utils/misc";
import type { CustomerInstallment } from "@utils/types/customer";
import { StatsCard } from "@components/customer/stats-card";
import { ProductGroupHeader } from "@components/customer/product-group-header";
import { InstallmentRow } from "@components/customer/installment-row";
import { InitializePaymentModal } from "@layouts/modal-layout/installment-initalization-modal";
import type { OverviewSearchType } from "@utils/schema";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";
import { Pagination } from "@components/shared/pagination";

interface InstallmentRowGroup {
  contractId: string;
  productName: string;
  productImage: string | null;
  totalFinanced: string;
  status: string;
  installments: CustomerInstallment[];
}

interface InstallmentPageProps {
  search: OverviewSearchType;
}

export function InstallmentsPage({ search }: InstallmentPageProps) {
  const { data, isLoading } = useQuery({
    ...getCustomerInstallmentsOptions(search),
  });

  const updateSearchParam = useUpdateSearchParam<OverviewSearchType>();
  const { prefetch } = usePrefetchQueryData(getCustomerInstallmentsOptions);

  const payMut = useInitializeInstallmentPayment();

  const [activeInstallment, setActiveInstallment] =
    useState<CustomerInstallment | null>(null);

  const installments = data?.installments ?? [];
  const pagination = data?.pagination;

  const onPrefetch = () =>
    prefetch({
      ...search,
      page: String((pagination?.currentPage || 1) + 1),
    });

  const onPageChange = (page: number) =>
    updateSearchParam("page", String(page));

  const onItemsPerPageChange = (itemsPerPage: number) =>
    updateSearchParam("limit", String(itemsPerPage));

  const { outstanding, paidToDate, remainingCount, progressPct } =
    useMemo(() => {
      const outstanding = installments
        .filter((i) => i.status !== "PAID")
        .reduce((sum, i) => sum + Number(i.amount), 0);
      const paidToDate = installments
        .filter((i) => i.status === "PAID")
        .reduce((sum, i) => sum + Number(i.amount), 0);
      const totalAmount =
        installments.reduce((sum, i) => sum + Number(i.amount), 0) || 1;
      const remainingCount = installments.filter(
        (i) => i.status !== "PAID"
      ).length;
      const progressPct = Math.round((paidToDate / totalAmount) * 100);

      return { outstanding, paidToDate, remainingCount, progressPct };
    }, [installments]);

  const groupedByContract = useMemo(() => {
    const groups: Record<string, InstallmentRowGroup> = {};

    installments.forEach((installment) => {
      const contract = installment.financingContract;
      const key = contract.contractId;

      if (!groups[key]) {
        const primaryImage =
          contract.kycApplication?.product?.images?.find(
            (img) => img.isPrimary
          ) ??
          contract.kycApplication?.product?.images?.[0] ??
          null;

        groups[key] = {
          contractId: contract.contractId,
          productName:
            contract.kycApplication?.product?.name ?? "Unknown product",
          productImage: primaryImage?.imageUrl ?? null,
          totalFinanced: contract.totalFinanced,
          status: contract.status,
          installments: [],
        };
      }

      groups[key].installments.push(installment);
    });

    return Object.values(groups);
  }, [installments]);

  const handlePay = async (installment: CustomerInstallment) => {
    try {
      await payMut.mutateAsync(installment.installmentId);
    } finally {
      setActiveInstallment(null);
    }
  };

  const handlePayClick = (installment: CustomerInstallment) => {
    setActiveInstallment(installment);
  };

  if (isLoading) {
    return (
      <AppShell title="Installments">
        <Flex justify="center" py={20}>
          <Spinner color="brand.400" />
        </Flex>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Installments"
      subtitle="Repayment schedule for your active financing contracts">
      <VStack align="stretch" spacing={6}>
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
          <StatsCard label="Outstanding" value={formatCurrency(outstanding)} />
          <StatsCard label="Paid to date" value={formatCurrency(paidToDate)} />
          <StatsCard label="Installments left" value={String(remainingCount)} />
        </SimpleGrid>

        <Box
          w="full"
          h="8px"
          bg="bgLayer1"
          borderRadius="full"
          overflow="hidden">
          <Box
            w={`${progressPct}%`}
            h="full"
            bgGradient="linear-gradient(90deg, #1E3A8A 0%, #7C3AED 100%)"
          />
        </Box>

        <VStack align="stretch" spacing={6}>
          {groupedByContract.map((group) => (
            <Box
              key={group.contractId}
              bg="bgLayer2"
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="2xl"
              overflow="hidden">
              <ProductGroupHeader
                productName={group.productName}
                productImage={group.productImage}
                totalFinanced={group.totalFinanced}
                contractStatus={group.status}
                installmentCount={group.installments.length}
                paidCount={
                  group.installments.filter((i) => i.status === "PAID").length
                }
              />

              <Box>
                <Box
                  px={5}
                  py={3}
                  bg="bgLayer1"
                  borderBottom="1px solid"
                  borderColor="borderStructural"
                  fontSize="11px"
                  color="textSecondary"
                  fontWeight={600}
                  letterSpacing="0.06em"
                  textTransform="uppercase">
                  <HStack>
                    <Text flex="0 0 50px">#</Text>
                    <Text flex={1}>Due date</Text>
                    <Text flex="0 0 140px" textAlign="right">
                      Amount
                    </Text>
                    <Text flex="0 0 130px">Status</Text>
                    <Text flex="0 0 120px" textAlign="right">
                      Action
                    </Text>
                  </HStack>
                </Box>
                {group.installments.map((installment) => (
                  <InstallmentRow
                    key={installment.installmentId}
                    installment={installment}
                    onClick={handlePayClick}
                  />
                ))}
              </Box>
            </Box>
          ))}

          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalItems={pagination?.total ?? 0}
            itemsPerPage={pagination?.limit || 10}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            onMouseEnter={onPrefetch}
          />
        </VStack>
      </VStack>

      {/* Payment initialization modal (Paystack-style) */}
      <InitializePaymentModal
        activeInstallment={activeInstallment}
        isOpen={!!activeInstallment}
        onClose={() => setActiveInstallment(null)}
        handlePay={handlePay}
        isPending={payMut.isPending}
      />
    </AppShell>
  );
}
