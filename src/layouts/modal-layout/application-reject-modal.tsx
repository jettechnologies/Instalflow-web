import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useToastContext } from "@hooks/context";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { rejectKycApplication } from "@services/mutations/kyc";

interface ApplicationRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicationName: string;
}

export const ApplicationRejectModal = ({
  isOpen,
  onClose,
  applicationId,
  applicationName,
}: ApplicationRejectModalProps) => {
  const [reason, setReason] = useState("");
  const { openToast } = useToastContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => rejectKycApplication(applicationId, reason.trim()),
    onSuccess: (data) => {
      openToast(
        data.message || "KYC Application rejected successfully.",
        "warning"
      );
      onClose();
      setReason("");
    },
  });

  const canSubmit = useMemo(() => reason.trim().length >= 5, [reason]);

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Reject application"
      subTitle={`Provide a reason for rejecting ${applicationName}'s application.`}
      autoClose={isPending}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="13px" color="textSecondary">
          The customer will see this rejection reason. Please be clear and
          professional.
        </Text>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          bg="bgLayer1"
          borderColor="borderStructural"
          minH="120px"
          placeholder="e.g. Bank statement name does not match user account profile."
        />
        <HStack spacing={3}>
          <Button variant="ghostOutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => mutateAsync()}
            isLoading={isPending}
            isDisabled={!canSubmit}
            colorScheme="red"
            flex="1">
            Confirm reject
          </Button>
        </HStack>
      </VStack>
    </ModalLayout>
  );
};
