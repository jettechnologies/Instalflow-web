import { useMutation } from "@tanstack/react-query";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { useToastContext } from "@hooks/context";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { approveKycApplication } from "@services/mutations/kyc";

interface ApplicationApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicationName: string;
}

export const ApplicationApproveModal = ({
  isOpen,
  onClose,
  applicationId,
  applicationName,
}: ApplicationApproveModalProps) => {
  const { openToast } = useToastContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => approveKycApplication(applicationId),
    onSuccess: (data) => {
      openToast(
        data.message ||
          "KYC application fully approved by both Marketer and Admin.",
        "success"
      );
      onClose();
    },
  });

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Approve application"
      subTitle={`You are about to approve ${applicationName}'s KYC application.`}
      autoClose={isPending}>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="13px" color="textSecondary">
          This action will sign your approval for this application. If both the
          marketer and admin have signed, the application will be fully approved
          and the customer account will be created.
        </Text>
        <HStack spacing={3}>
          <Button variant="ghostOutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => mutateAsync()}
            isLoading={isPending}
            leftIcon={<Check size={16} />}
            flex="1">
            Confirm approval
          </Button>
        </HStack>
      </VStack>
    </ModalLayout>
  );
};
