import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import type {
  ComissionPayoutRequestStatus,
  MarketerBankAccount,
} from "@utils/types/response-type";
import { List, Copy, Check, Building2, ShieldCheck, Star } from "lucide-react";
import { tokens } from "@theme";

const statusMeta: Record<
  ComissionPayoutRequestStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING_ADMIN_APPROVAL: {
    label: "Pending Admin",
    color: tokens.status.warning,
    bg: "rgba(245,158,11,0.12)",
  },
  PENDING_COMPANY_APPROVAL: {
    label: "Pending Company",
    color: tokens.status.warning,
    bg: "rgba(245,158,11,0.12)",
  },
  APPROVED: {
    label: "Approved",
    color: tokens.status.success,
    bg: "rgba(16,185,129,0.12)",
  },
  REJECTED: {
    label: "Rejected",
    color: tokens.status.danger,
    bg: "rgba(239,68,68,0.12)",
  },
  TRANSFER_INITIATED: {
    label: "Transfer Initiated",
    color: tokens.status.info,
    bg: "rgba(6,182,212,0.12)",
  },
  PAID: {
    label: "Paid",
    color: tokens.status.success,
    bg: "rgba(16,185,129,0.12)",
  },
  TRANSFER_FAILED: {
    label: "Transfer Failed",
    color: tokens.status.danger,
    bg: "rgba(239,68,68,0.12)",
  },
  TRANSFER_REVERSED: {
    label: "Reversed",
    color: tokens.status.danger,
    bg: "rgba(239,68,68,0.12)",
  },
};

export const MarketerDetailsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box
    bg={tokens.bg.layer2}
    border="1px solid"
    borderColor={tokens.border.structural}
    borderRadius="12px"
    overflow="hidden">
    <Box
      px={5}
      py={4}
      borderBottom="1px solid"
      borderColor={tokens.border.structural}>
      <Text
        fontSize="13px"
        fontWeight={600}
        color={tokens.text.secondary}
        letterSpacing="0.06em"
        textTransform="uppercase">
        {title}
      </Text>
    </Box>
    {children}
  </Box>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accentColor: string;
  isCurrency?: boolean;
}

export const MarketerDetailsStatCard = ({
  label,
  value,
  icon: IconEl,
  accentColor,
}: StatCardProps) => (
  <Box
    bg={tokens.bg.layer2}
    border="1px solid"
    borderColor={tokens.border.structural}
    borderRadius="12px"
    p={5}
    position="relative"
    overflow="hidden"
    _before={{
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "3px",
      bg: accentColor,
      borderRadius: "12px 0 0 12px",
    }}>
    <Flex justify="space-between" align="flex-start" mb={3}>
      <Box
        p={2}
        borderRadius="8px"
        bg={`${accentColor}18`}
        border="1px solid"
        borderColor={`${accentColor}30`}>
        <Icon as={IconEl} boxSize={4} color={accentColor} />
      </Box>
    </Flex>
    <Text
      fontSize="22px"
      fontWeight={700}
      letterSpacing="-0.02em"
      bgGradient={`linear(to-r, ${accentColor}, ${accentColor}cc)`}
      bgClip="text"
      lineHeight={1.1}
      mb={1}>
      {value}
    </Text>
    <Text
      fontSize="12px"
      color={tokens.text.muted}
      fontWeight={500}
      letterSpacing="0.01em">
      {label}
    </Text>
  </Box>
);

export const CopyChip = ({ value }: { value: string }) => {
  const { hasCopied, onCopy } = useClipboard(value);
  return (
    <Tooltip
      label={hasCopied ? "Copied!" : "Copy referral code"}
      placement="top">
      <HStack
        as="button"
        onClick={onCopy}
        spacing={2}
        px={3}
        py={1.5}
        bg={`${tokens.brand.primary}15`}
        border="1px solid"
        borderColor={`${tokens.brand.primary}40`}
        borderRadius="8px"
        cursor="pointer"
        transition="all 0.15s ease"
        _hover={{
          bg: `${tokens.brand.primary}25`,
          borderColor: `${tokens.brand.primary}70`,
        }}>
        <Text
          fontSize="13px"
          fontWeight={600}
          color={tokens.brand.primary}
          fontFamily="mono">
          {value}
        </Text>
        <Icon
          as={hasCopied ? Check : Copy}
          boxSize={3.5}
          color={hasCopied ? tokens.status.success : tokens.brand.primary}
        />
      </HStack>
    </Tooltip>
  );
};

export const StatusPill = ({
  status,
}: {
  status: ComissionPayoutRequestStatus;
}) => {
  const meta = statusMeta[status];
  return (
    <Box
      px={2.5}
      py={1}
      borderRadius="6px"
      bg={meta.bg}
      border="1px solid"
      borderColor={`${meta.color}35`}
      display="inline-flex">
      <Text
        fontSize="11px"
        fontWeight={600}
        color={meta.color}
        letterSpacing="0.03em">
        {meta.label}
      </Text>
    </Box>
  );
};

export const MarketerDetailsBankCard = ({
  account,
}: {
  account: MarketerBankAccount;
}) => (
  <Box
    bg={tokens.bg.layer2}
    border="1px solid"
    borderColor={
      account.isPrimary ? `${tokens.brand.primary}50` : tokens.border.structural
    }
    borderRadius="10px"
    p={4}
    position="relative">
    {account.isPrimary && (
      <Box position="absolute" top={3} right={3}>
        <HStack
          spacing={1}
          px={2}
          py={0.5}
          bg={`${tokens.brand.primary}18`}
          borderRadius="6px">
          <Icon
            as={Star}
            boxSize={3}
            color={tokens.brand.primary}
            fill={tokens.brand.primary}
          />
          <Text
            fontSize="10px"
            fontWeight={700}
            color={tokens.brand.primary}
            letterSpacing="0.05em">
            PRIMARY
          </Text>
        </HStack>
      </Box>
    )}
    <HStack spacing={3} mb={3}>
      <Box
        p={2}
        borderRadius="8px"
        bg={`${tokens.status.info}15`}
        border="1px solid"
        borderColor={`${tokens.status.info}30`}>
        <Icon as={Building2} boxSize={4} color={tokens.status.info} />
      </Box>
      <Text fontSize="14px" fontWeight={600} color={tokens.text.primary}>
        {account.bankName}
      </Text>
    </HStack>
    <VStack align="flex-start" spacing={1}>
      <Text fontSize="13px" color={tokens.text.secondary}>
        {account.accountName}
      </Text>
      <Text
        fontSize="14px"
        fontWeight={600}
        fontFamily="mono"
        color={tokens.text.primary}
        letterSpacing="0.05em">
        {account.accountNumber}
      </Text>
    </VStack>
    <Flex
      mt={3}
      pt={3}
      borderTop="1px solid"
      borderColor={tokens.border.structural}
      align="center">
      <HStack spacing={1.5}>
        <Icon
          as={ShieldCheck}
          boxSize={3.5}
          color={account.isVerified ? tokens.status.success : tokens.text.muted}
        />
        <Text
          fontSize="11px"
          fontWeight={600}
          color={
            account.isVerified ? tokens.status.success : tokens.text.muted
          }>
          {account.isVerified ? "Verified" : "Unverified"}
        </Text>
      </HStack>
    </Flex>
  </Box>
);

export const MarketerDetailsEmpty = ({ label }: { label: string }) => (
  <Flex py={10} justify="center" align="center" direction="column" gap={2}>
    <Icon as={List} boxSize={6} color={tokens.text.muted} />
    <Text fontSize="13px" color={tokens.text.muted}>
      {label}
    </Text>
  </Flex>
);
