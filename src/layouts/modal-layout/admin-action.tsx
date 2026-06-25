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
          <Icon as={config.icon} boxSize={12} color="brand.500" />

          <Heading size="md" textAlign="center">
            {config.title}
          </Heading>

          <Text
            textAlign="center"
            color="textSecondary"
            fontSize="sm"
            maxW="420px">
            {config.description}
          </Text>
        </VStack>

        <VStack
          align="stretch"
          spacing={4}
          p={4}
          bg="bgLayer1"
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="xl">
          <HStack justify="space-between">
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="textMuted"
              fontWeight="600">
              Marketer
            </Text>

            <Text fontSize="sm" fontWeight="600">
              {adminName}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="textMuted"
              fontWeight="600">
              Action
            </Text>

            <Text fontSize="sm" fontWeight="600" color="brand.400">
              {action === "TOGGLE_STATUS"
                ? active
                  ? "Suspend Account"
                  : "Activate Account"
                : "Delete Account"}
            </Text>
          </HStack>
        </VStack>

        <HStack spacing={3}>
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
