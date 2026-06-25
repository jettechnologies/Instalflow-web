import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCircle, XCircle } from "lucide-react";
import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import { TextAreaField } from "@components/forms/input-field";
import { useHandleApprovalRequest } from "@services/tanstack-mutations/staff-maanagement";
import type { ReviewAction } from "@utils/types/response-type";
import { reviewSchema, type ReviewSchemaType } from "@utils/schema";

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  targetUserName: string;
  requestedAction: string;
  reviewAction: ReviewAction;
}

const ACTION_CONFIG: Record<
  ReviewAction,
  {
    icon: React.ElementType;
    title: string;
    description: (name: string) => string;
    buttonText: string;
    iconColor: string;
    badgeBg: string;
    badgeColor: string;
  }
> = {
  APPROVED: {
    icon: CheckCircle,
    title: "Approve Request",
    description: (name) =>
      `Approving this request will immediately apply the action for ${name}.`,
    buttonText: "Approve Request",
    iconColor: "statusSuccess",
    badgeBg: "rgba(16,185,129,0.12)",
    badgeColor: "#10B981",
  },
  REJECTED: {
    icon: XCircle,
    title: "Reject Request",
    description: (name) =>
      `Rejecting this request will dismiss the pending action for ${name}.`,
    buttonText: "Reject Request",
    iconColor: "statusDanger",
    badgeBg: "rgba(239,68,68,0.12)",
    badgeColor: "#EF4444",
  },
};

const REQUESTED_ACTION_LABEL: Record<string, string> = {
  TOGGLE_ACTIVE: "Toggle Status",
  DELETE_ACCOUNT: "Delete Account",
};

export const ApprovalActionModal = ({
  isOpen,
  onClose,
  requestId,
  targetUserName,
  requestedAction,
  reviewAction,
}: ApprovalActionModalProps) => {
  const { mutateAsync: handleApproval, isPending } = useHandleApprovalRequest();

  const config = ACTION_CONFIG[reviewAction];
  const actionLabel =
    REQUESTED_ACTION_LABEL[requestedAction] ?? requestedAction;
  const isRejection = reviewAction === "REJECTED";

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={config.title}
      autoClose={isPending}>
      <Formik<ReviewSchemaType>
        initialValues={{ reviewReason: "" }}
        validationSchema={reviewSchema}
        // validationContext={{ isRejection }}
        onSubmit={async ({ reviewReason }, { setSubmitting }) => {
          try {
            await handleApproval({
              requestId,
              data: {
                status: reviewAction,
                reviewReason: isRejection
                  ? reviewReason?.trim() || undefined
                  : undefined,
              },
            });
            onClose();
          } catch {
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => (
          <VStack as={Form} spacing={6} align="stretch">
            <VStack spacing={3}>
              <Icon as={config.icon} boxSize={10} color={config.iconColor} />

              <Heading size="md" textAlign="center">
                {config.title}
              </Heading>

              <Text
                textAlign="center"
                color="textSecondary"
                fontSize="sm"
                maxW="420px">
                {config.description(targetUserName)}
              </Text>
            </VStack>

            <Box
              bg="bgLayer1"
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="xl"
              p={4}>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="textMuted"
                    fontWeight="600">
                    Requested Action
                  </Text>

                  <Badge
                    bg={config.badgeBg}
                    color={config.badgeColor}
                    borderRadius="full"
                    px="10px"
                    py="4px"
                    fontSize="xs"
                    textTransform="none"
                    fontWeight="600">
                    {actionLabel}
                  </Badge>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="textMuted"
                    fontWeight="600">
                    Target User
                  </Text>

                  <Text fontSize="sm" fontWeight="600" color="textPrimary">
                    {targetUserName}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {isRejection && (
              <Box
                border="1px solid"
                borderColor="rgba(239,68,68,0.2)"
                bg="rgba(239,68,68,0.03)"
                borderRadius="xl"
                p={4}>
                <TextAreaField
                  name="reviewReason"
                  label="Reason for rejection"
                  placeholder="Explain why this request is being rejected..."
                  height="100px"
                />
              </Box>
            )}

            <HStack spacing={3}>
              <Button
                flex={1}
                type="button"
                variant="ghostOutline"
                onClick={onClose}>
                Cancel
              </Button>

              <Button
                flex={1}
                type="submit"
                colorScheme={isRejection ? "red" : undefined}
                isLoading={isSubmitting || isPending}
                loadingText="Processing...">
                {config.buttonText}
              </Button>
            </HStack>
          </VStack>
        )}
      </Formik>
    </ModalLayout>
  );
};
