import { Button, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { ModalLayout } from "./modal";
import {
  useDeleteAdminAccount,
  useToggleAdminStatus,
} from "@services/tanstack-mutations/staff-maanagement";
import type { UserActions } from "@utils/types/response-type";

interface AdminActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
  adminName: string;
  active: boolean;
  action: UserActions;
}

export const AdminActionModal = ({
  isOpen,
  onClose,
  adminId,
  adminName,
  active,
  action,
}: AdminActionModalProps) => {
  const { mutateAsync: toggleStatus, isPending: toggling } =
    useToggleAdminStatus();

  const { mutateAsync: deleteAccount, isPending: deleting } =
    useDeleteAdminAccount();

  const config = (() => {
    if (action === "TOGGLE_STATUS") {
      return {
        icon: active ? ShieldX : ShieldCheck,
        title: active ? "Suspend Admin" : "Activate Admin",

        description: active
          ? `${adminName} will immediately lose access to Instalflow and all active sessions will be revoked.`
          : `${adminName} will immediately regain access to Instalflow.`,

        buttonText: active ? "Suspend Admin" : "Activate Admin",
      };
    }

    return {
      icon: Trash2,
      title: "Delete Admin",

      description: `${adminName}'s account will be soft deleted immediately and all active sessions will be revoked.`,

      buttonText: "Delete Admin",
    };
  })();

  const handleConfirm = async () => {
    try {
      if (action === "TOGGLE_STATUS") {
        await toggleStatus(adminId);
      }

      if (action === "DELETE_ACCOUNT") {
        await deleteAccount(adminId);
      }

      onClose();
    } catch {}
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={config.title}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={3}>
          <Icon
            as={config.icon}
            boxSize={10}
            color={
              action === "DELETE_ACCOUNT"
                ? "statusDanger"
                : active
                  ? "statusWarning"
                  : "statusSuccess"
            }
          />
          <Heading size="md" textAlign="center">
            {config.title}
          </Heading>
          <Text textAlign="center" color="textSecondary" fontSize="sm">
            {config.description}
          </Text>
        </VStack>
        <HStack>
          <Button flex={1} variant="ghostOutline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            flex={1}
            colorScheme={action === "DELETE_ACCOUNT" ? "red" : undefined}
            isLoading={toggling || deleting}
            loadingText="Processing..."
            onClick={handleConfirm}>
            {config.buttonText}
          </Button>
        </HStack>
      </VStack>
    </ModalLayout>
  );
};
