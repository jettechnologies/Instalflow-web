import { type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@components/shared/AppShell";
import { useInitializeInstallmentPayment } from "@services/tanstack-mutations";
import { getInstallmentDetailQueryOptions } from "@services/tanstack-queries";
import { formatCurrency, formatDate } from "@utils/misc";
import type { InstallmentStatus } from "@utils/types/customer";
import { InitializePaymentModal } from "@layouts/modal-layout/installment-initalization-modal";

const statusTone: Record<
  InstallmentStatus,
  { bg: string; fg: string; label: string; icon: ReactNode }
> = {
  PAID: {
    bg: "rgba(16,185,129,0.16)",
    fg: "statusSuccess",
    label: "PAID",
    icon: <CheckCircle2 size={12} />,
  },
  DUE: {
    bg: "rgba(245,158,11,0.16)",
    fg: "statusWarning",
    label: "DUE TODAY",
    icon: <AlertCircle size={12} />,
  },
  DUE_SOON: {
    bg: "rgba(245,158,11,0.10)",
    fg: "statusWarning",
    label: "DUE SOON",
    icon: <Clock size={12} />,
  },
  OVERDUE: {
    bg: "rgba(239,68,68,0.14)",
    fg: "statusDanger",
    label: "OVERDUE",
    icon: <AlertCircle size={12} />,
  },
  UPCOMING: {
    bg: "rgba(148,163,184,0.10)",
    fg: "textMuted",
    label: "UPCOMING",
    icon: <Calendar size={12} />,
  },
  PENDING: {
    bg: "rgba(148,163,184,0.10)",
    fg: "textMuted",
    label: "PENDING",
    icon: <Clock size={12} />,
  },
};

interface InstallmentDetailProps {
  installmentId: string;
}

export function InstallmentDetail({ installmentId }: InstallmentDetailProps) {
  const { data: installment, isLoading } = useQuery({
    ...getInstallmentDetailQueryOptions(installmentId),
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const payMut = useInitializeInstallmentPayment();

  const handlePay = async () => {
    await payMut.mutateAsync(installmentId);
  };

  const t = installment ? statusTone[installment.status] : undefined;
  const isPaid = installment?.status === "PAID";

  const product = installment?.financingContract?.kycApplication?.product;
  const contract = installment?.financingContract;
  const primaryImage =
    product?.images?.find((img) => img.isPrimary) ??
    product?.images?.[0] ??
    null;

  const payments = installment?.payments ?? [];

  const detailRows = [
    {
      label: "Sequence",
      value: `#${String(installment?.sequence ?? 0).padStart(2, "0")}`,
    },
    {
      label: "Due date",
      value: installment ? formatDate(installment.dueDate) : "-",
    },
    {
      label: "Created",
      value: installment ? formatDate(installment.createdAt) : "-",
    },
    {
      label: "Paid at",
      value: installment?.paidAt ? formatDate(installment.paidAt) : "-",
    },
    { label: "Contract status", value: contract?.status ?? "-" },
    {
      label: "Total financed",
      value: contract ? formatCurrency(Number(contract.totalFinanced)) : "-",
    },
  ];

  if (isLoading) {
    return (
      <AppShell title="Installment">
        <Flex justify="center" py={20}>
          <Spinner color="brand.400" />
        </Flex>
      </AppShell>
    );
  }

  if (!installment) {
    return (
      <AppShell title="Installment not found">
        <VStack align="start" spacing={1} py={10}>
          <Text fontWeight={600}>We couldn't find this installment</Text>
          <Text color="textSecondary" fontSize="13px">
            It may have been removed, or the link is out of date.
          </Text>
          <Button
            as={Link}
            to="/customer/installments"
            mt={4}
            leftIcon={<ArrowLeft size={16} />}
            variant="ghostOutline">
            Back to installments
          </Button>
        </VStack>
      </AppShell>
    );
  }

  return (
    <>
      <AppShell
        title={`Installment #${String(installment.sequence).padStart(2, "0")}`}
        subtitle="Payment details and history"
        actions={
          isPaid ? undefined : (
            <Button
              leftIcon={<CreditCard size={16} />}
              isLoading={payMut.isPending}
              onClick={onOpen}>
              Pay {formatCurrency(Number(installment.amount))}
            </Button>
          )
        }>
        <VStack align="stretch" spacing={6}>
          {/* Product + amount header */}
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={6}>
            <Grid templateColumns="80px 1fr" gap={5} alignItems="start">
              <GridItem>
                {primaryImage ? (
                  <img
                    src={primaryImage.imageUrl}
                    alt={product?.name ?? "Product"}
                    className="w-[80px] h-[80px] object-cover rounded-lg"
                  />
                ) : (
                  <Flex
                    w="80px"
                    h="80px"
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg="bgLayer1"
                    border="1px solid"
                    borderColor="borderStructural"
                    color="textMuted">
                    <Shield size={24} />
                  </Flex>
                )}
              </GridItem>
              <GridItem minW={0}>
                <Heading size="sm" color="textPrimary" noOfLines={1}>
                  {product?.name ?? "Unknown product"}
                </Heading>
                <Text fontSize="12px" color="textMuted" mt={1}>
                  {product?.description ?? ""}
                </Text>
                <HStack spacing={2} mt={3}>
                  {t && (
                    <>
                      <Box
                        w="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {t.icon}
                      </Box>
                      <Badge
                        bg={t.bg}
                        color={t.fg}
                        px={2.5}
                        py={1}
                        borderRadius="full"
                        fontSize="10px"
                        fontWeight={700}
                        letterSpacing="0.05em"
                        textTransform="uppercase">
                        {t.label}
                      </Badge>
                    </>
                  )}
                  <Text fontSize="13px" color="textSecondary">
                    {isPaid ? "Settled" : "Awaiting payment"}
                  </Text>
                </HStack>
              </GridItem>
            </Grid>
          </Box>

          {/* Amount + key details */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box
              bg="bgLayer2"
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="2xl"
              p={6}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em"
                textTransform="uppercase">
                AMOUNT
              </Text>
              <Text
                fontSize="28px"
                fontWeight={800}
                mt={2}
                letterSpacing="-0.02em"
                color="textPrimary">
                {formatCurrency(Number(installment.amount))}
              </Text>
            </Box>
            <Box
              bg="bgLayer2"
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="2xl"
              p={6}>
              <Text
                fontSize="11px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em"
                textTransform="uppercase">
                PROGRESS
              </Text>
              <Text
                fontSize="28px"
                fontWeight={800}
                mt={2}
                letterSpacing="-0.02em"
                color="textPrimary">
                {isPaid ? "100%" : "0%"}
              </Text>
            </Box>
          </SimpleGrid>

          {/* Detail grid */}
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            overflow="hidden">
            <Box
              px={5}
              py={4}
              borderBottom="1px solid"
              borderColor="borderStructural">
              <Heading size="sm" color="textPrimary">
                Installment details
              </Heading>
            </Box>
            <Grid templateColumns="1fr 1fr" gap={0}>
              {detailRows.map((row) => (
                <>
                  <GridItem
                    px={5}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="borderStructural">
                    <Text
                      fontSize="11px"
                      color="textMuted"
                      fontWeight={600}
                      letterSpacing="0.05em">
                      {row.label}
                    </Text>
                  </GridItem>
                  <GridItem
                    px={5}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="borderStructural">
                    <Text fontSize="13px" color="textPrimary" fontWeight={500}>
                      {row.value}
                    </Text>
                  </GridItem>
                </>
              ))}
            </Grid>
          </Box>

          {/* Payment history */}
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            overflow="hidden">
            <Box
              px={5}
              py={4}
              borderBottom="1px solid"
              borderColor="borderStructural">
              <Heading size="sm" color="textPrimary">
                Payment history
              </Heading>
            </Box>

            {payments.length === 0 ? (
              <Box px={5} py={6} textAlign="center">
                <Text fontSize="12px" color="textMuted">
                  {isPaid
                    ? "Payment recorded via webhook."
                    : "No payments have been recorded for this installment yet."}
                </Text>
              </Box>
            ) : (
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
                    <Text flex={1}>Reference</Text>
                    <Text flex="0 0 120px" textAlign="right">
                      Amount
                    </Text>
                    <Text flex="0 0 140px">Date</Text>
                    <Text flex="0 0 100px" textAlign="right">
                      Status
                    </Text>
                  </HStack>
                </Box>
                {payments.map((payment) => (
                  <HStack
                    key={payment.paymentId}
                    px={5}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="borderStructural"
                    _last={{ borderBottom: "none" }}
                    spacing={4}>
                    <Text
                      flex={1}
                      fontFamily="mono"
                      fontSize="12px"
                      color="textPrimary"
                      noOfLines={1}>
                      {payment.reference}
                    </Text>
                    <Text
                      flex="0 0 120px"
                      textAlign="right"
                      fontSize="13px"
                      fontWeight={500}
                      color="textPrimary">
                      {formatCurrency(Number(payment.amount))}
                    </Text>
                    <Text
                      flex="0 0 140px"
                      fontSize="12px"
                      color="textSecondary">
                      {formatDate(payment.createdAt)}
                    </Text>
                    <Badge
                      flex="0 0 100px"
                      textAlign="right"
                      bg="rgba(16,185,129,0.16)"
                      color="statusSuccess"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight={700}>
                      {payment.status}
                    </Badge>
                  </HStack>
                ))}
              </Box>
            )}
          </Box>
        </VStack>
      </AppShell>

      {/* payment initialization modal */}
      <InitializePaymentModal
        activeInstallment={installment}
        isOpen={isOpen}
        onClose={onClose}
        handlePay={handlePay}
        isPending={payMut.isPending}
      />
    </>
  );
}
