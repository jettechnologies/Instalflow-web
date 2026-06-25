import { Button, Heading, Icon, Text, VStack, HStack } from "@chakra-ui/react";
import { Trash2, UserCheck, UserX, ClipboardList } from "lucide-react";
import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import { TextAreaField } from "@components/forms/input-field";
import {
  useDeleteMarketerAccount,
  useRequestDeleteMarketerAccount,
  useRequestToggleMarketerStatus,
  useToggleMarketerStatus,
} from "@services/tanstack-mutations/staff-maanagement";
import type { UserActions } from "@utils/types/response-type";
import type { UserRole } from "@utils/types";
import { requestReasonSchema, type RequestReasonValues } from "@utils/schema";

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

  const isCompany = role === "COMPANY";

  const config = (() => {
    if (isCompany) {
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
        description: `This will soft delete ${marketerName}'s account and revoke all active sessions.`,
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

  if (isCompany) {
    const isPending = toggling || deleting;

    const handleConfirm = async () => {
      try {
        if (action === "TOGGLE_STATUS") await toggleStatus(marketerId);
        if (action === "DELETE_ACCOUNT") await deleteAccount(marketerId);
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
            <Button variant="ghostOutline" onClick={onClose} flex={1}>
              Cancel
            </Button>
            <Button
              flex={1}
              isLoading={isPending}
              loadingText="Processing..."
              onClick={handleConfirm}>
              {config.buttonText}
            </Button>
          </HStack>
        </VStack>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={config.title}>
      <Formik<RequestReasonValues>
        initialValues={{ reason: "" }}
        validationSchema={requestReasonSchema}
        onSubmit={async ({ reason }, { setSubmitting }) => {
          try {
            const trimmedReason = reason?.trim() || undefined;

            if (action === "TOGGLE_STATUS") {
              await requestToggleStatus({ marketerId, reason: trimmedReason });
            }

            if (action === "DELETE_ACCOUNT") {
              await requestDeleteAccount({ marketerId, reason: trimmedReason });
            }

            onClose();
          } catch {
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => {
          const isPending =
            isSubmitting || requestingToggle || requestingDelete;

          return (
            <VStack as={Form} spacing={6} align="stretch">
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
                    {marketerName}
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

              <VStack align="stretch" spacing={3}>
                <TextAreaField
                  name="reason"
                  label="Reason for Request"
                  placeholder="Explain why this action is required..."
                  height="120px"
                />

                <Text fontSize="xs" color="textMuted">
                  This explanation will be visible to the company owner when
                  reviewing your request.
                </Text>
              </VStack>

              <HStack spacing={3}>
                <Button
                  type="button"
                  variant="ghostOutline"
                  onClick={onClose}
                  flex={1}>
                  Cancel
                </Button>

                <Button
                  type="submit"
                  flex={1}
                  isLoading={isPending}
                  loadingText="Submitting...">
                  {config.buttonText}
                </Button>
              </HStack>
            </VStack>
          );
        }}
      </Formik>
    </ModalLayout>
  );
};
