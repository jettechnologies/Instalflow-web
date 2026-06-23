import { Button, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import { Trash2, UserCheck, UserX, ClipboardList } from "lucide-react";
import { ModalLayout } from "./modal";
import {
  useDeleteMarketerAccount,
  useRequestDeleteMarketerAccount,
  useRequestToggleMarketerStatus,
  useToggleMarketerStatus,
} from "@services/tanstack-mutations/staff-maanagement";
import type { UserActions } from "@utils/types/response-type";
import type { UserRole } from "@utils/types";

interface MarketerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketerId: string;
  marketerName: string;
  active: boolean;
  role: Exclude<UserRole, "CUSTOMER" | "MARKETER">;
  action: UserActions;
}

export const MarketerActionModal = ({
  isOpen,
  onClose,
  marketerId,
  marketerName,
  active,
  role,
  action,
}: MarketerActionModalProps) => {
  const { mutateAsync: toggleStatus, isPending: toggling } =
    useToggleMarketerStatus();

  const { mutateAsync: deleteAccount, isPending: deleting } =
    useDeleteMarketerAccount();

  const { mutateAsync: requestToggleStatus, isPending: requestingToggle } =
    useRequestToggleMarketerStatus();

  const { mutateAsync: requestDeleteAccount, isPending: requestingDelete } =
    useRequestDeleteMarketerAccount();

  const isLoading =
    toggling || deleting || requestingToggle || requestingDelete;

  const config = (() => {
    if (role === "COMPANY") {
      if (action === "TOGGLE_STATUS") {
        return {
          icon: active ? UserX : UserCheck,
          title: active ? "Suspend Marketer" : "Activate Marketer",
          description: active
            ? `This will immediately suspend ${marketerName} and revoke all active sessions.`
            : `${marketerName} will regain access to Instalflow immediately.`,
          buttonText: active ? "Suspend Marketer" : "Activate Marketer",
        };
      }

      return {
        icon: Trash2,
        title: "Delete Marketer",
        description: `This will soft delete ${marketerName}'s account immediately and revoke all active sessions.`,
        buttonText: "Delete Marketer",
      };
    }

    if (action === "TOGGLE_STATUS") {
      return {
        icon: ClipboardList,
        title: active ? "Request Suspension" : "Request Activation",
        description: active
          ? `A suspension request will be submitted for approval.`
          : `An activation request will be submitted for approval.`,
        buttonText: "Submit Request",
      };
    }

    return {
      icon: ClipboardList,
      title: "Request Account Deletion",
      description:
        "A marketer deletion request will be submitted for approval.",
      buttonText: "Submit Request",
    };
  })();

  const handleConfirm = async () => {
    try {
      if (role === "COMPANY") {
        if (action === "TOGGLE_STATUS") {
          await toggleStatus(marketerId);
        }

        if (action === "DELETE_ACCOUNT") {
          await deleteAccount(marketerId);
        }
      }

      if (role === "ADMIN") {
        if (action === "TOGGLE_STATUS") {
          await requestToggleStatus(marketerId);
        }

        if (action === "DELETE_ACCOUNT") {
          await requestDeleteAccount(marketerId);
        }
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
            color={action === "DELETE_ACCOUNT" ? "statusDanger" : "brand.500"}
          />
          <Heading size="md" textAlign="center">
            {config.title}
          </Heading>
          <Text textAlign="center" color="textSecondary" fontSize="sm">
            {config.description}
          </Text>
        </VStack>
        <HStack>
          <Button
            type="button"
            variant="ghostOutline"
            onClick={onClose}
            flex={1}>
            Cancel
          </Button>
          <Button
            type="button"
            flex={1}
            isLoading={isLoading}
            loadingText="Processing..."
            onClick={handleConfirm}>
            {config.buttonText}
          </Button>
        </HStack>
      </VStack>
    </ModalLayout>
  );
};
