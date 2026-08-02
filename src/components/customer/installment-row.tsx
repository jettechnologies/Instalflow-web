import { useNavigate } from "@tanstack/react-router";
import { Grid, Box, HStack, Text, Badge, Button } from "@chakra-ui/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDate } from "@utils/misc";
import type { CustomerInstallment, InstallmentStatus } from "@utils/types";
import type { ReactNode } from "react";

interface InstallmentRowProps {
  installment: CustomerInstallment;
  onClick: (installment: CustomerInstallment) => void;
}

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

export function InstallmentRow({ installment, onClick }: InstallmentRowProps) {
  const navigate = useNavigate();
  const t = statusTone[installment.status];
  const dueDate = new Date(installment.dueDate);
  const isPaid = installment.status === "PAID";

  const goToDetail = () => {
    // adjust the route id/params to match your actual route tree
    navigate({
      to: "/customer/installments/$installmentId",
      params: { installmentId: installment.installmentId },
    });
  };

  return (
    <Grid
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
      templateColumns={{
        base: "1fr",
        md: "56px minmax(0, 1fr) 130px 110px 110px",
      }}
      alignItems="center"
      columnGap={4}
      rowGap={2}
      px={5}
      py={4}
      borderBottom="1px solid"
      borderColor="borderStructural"
      cursor="pointer"
      transition="background 0.15s ease"
      _hover={{ bg: "whiteAlpha.50" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "brand.500",
        outlineOffset: "-2px",
      }}>
      <Text fontFamily="mono" fontSize="13px" color="textSecondary">
        #{String(installment.sequence).padStart(2, "0")}
      </Text>

      <Box minW={0}>
        <Text fontSize="13px" color="textPrimary">
          {dueDate.toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
        {installment.paidAt && (
          <Text fontSize="11px" color="textMuted" noOfLines={1}>
            Paid {formatDate(installment.paidAt)} ·{" "}
            {installment.payments?.[0]?.reference ?? "—"}
          </Text>
        )}
      </Box>

      <Text
        textAlign={{ base: "left", md: "right" }}
        fontSize="13px"
        fontWeight={700}
        color="textPrimary">
        {formatCurrency(Number(installment.amount))}
      </Text>

      <Box justifySelf={{ base: "start", md: "center" }}>
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
      </Box>

      <Box justifySelf={{ base: "start", md: "end" }}>
        {isPaid ? (
          <HStack color="statusSuccess" fontSize="12px" spacing={1}>
            <CheckCircle2 size={14} />
            <Text>Settled</Text>
          </HStack>
        ) : (
          <Button
            size="sm"
            h="32px"
            px={4}
            fontSize="12px"
            leftIcon={<CreditCard size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              onClick(installment);
            }}>
            Pay
          </Button>
        )}
      </Box>
    </Grid>
  );
}
