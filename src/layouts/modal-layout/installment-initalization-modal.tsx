import { Box, HStack, Text, Button } from "@chakra-ui/react";
import { CreditCard } from "lucide-react";
import { ModalLayout } from "./modal";
import type { CustomerInstallment } from "@utils/types";
import { formatCurrency } from "@utils/misc";

interface InitializePaymentModalProps {
  activeInstallment: CustomerInstallment | null;
  isOpen: boolean;
  onClose: () => void;
  handlePay: (installment: CustomerInstallment) => void;
  isPending?: boolean;
}

export function InitializePaymentModal({
  activeInstallment,
  isOpen,
  onClose,
  handlePay,
  isPending,
}: InitializePaymentModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Initialize payment"
      modalFooter={
        <HStack spacing={3} justify="flex-end" w="full">
          <Button variant="ghostOutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handlePay(activeInstallment as CustomerInstallment)}
            isLoading={isPending}>
            Initialize
          </Button>
        </HStack>
      }>
      {activeInstallment && (
        <>
          <Box
            p={4}
            bg="bgLayer1"
            borderRadius="md"
            border="1px solid"
            borderColor="borderStructural">
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              AMOUNT DUE
            </Text>
            <Text
              fontSize="28px"
              fontWeight={800}
              mt={1}
              letterSpacing="-0.02em"
              color="textPrimary">
              {formatCurrency(Number(activeInstallment.amount))}
            </Text>
            <Text fontSize="11px" color="textMuted" mt={1}>
              Installment #{String(activeInstallment.sequence).padStart(2, "0")}{" "}
              · Due{" "}
              {new Date(activeInstallment.dueDate).toLocaleDateString("en-NG")}
            </Text>
          </Box>

          <Box
            mt={4}
            p={4}
            bg="bgLayer1"
            borderRadius="md"
            border="1px dashed"
            borderColor="borderStructural">
            <HStack spacing={3} align="start">
              <Box color="brand.300">
                <CreditCard size={18} />
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight={600} color="textPrimary">
                  You'll be redirected to Paystack
                </Text>
                <Text fontSize="11px" color="textMuted" mt={1}>
                  Complete your payment via card, bank transfer, or USSD on
                  Paystack's secure checkout. We'll confirm the payment
                  automatically via webhook.
                </Text>
              </Box>
            </HStack>
          </Box>
        </>
      )}
    </ModalLayout>
  );
}
