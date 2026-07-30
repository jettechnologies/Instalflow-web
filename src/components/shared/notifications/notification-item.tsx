import { Box, HStack, Text, Icon as ChakraIcon } from "@chakra-ui/react";
import { Check } from "lucide-react";
import type { InternalNotification } from "@utils/types/notification";
import { getNotificationTypeConfig } from "./notification-type-map";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

interface NotificationItemProps {
  notification: InternalNotification;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkRead: (id: string) => void;
  onNavigate: (to: string) => void;
}

export function NotificationItem({
  notification,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onMarkRead,
  onNavigate,
}: NotificationItemProps) {
  const config = getNotificationTypeConfig(notification.type);
  const Icon = config.icon;
  const isUnread = notification.status === "UNREAD";

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelect(notification.notificationId);
      return;
    }
    if (isUnread) {
      onMarkRead(notification.notificationId);
    }
    const route = config?.getRoute?.(notification.metadata!);

    if (route) {
      setTimeout(() => {
        onNavigate(route);
      }, 500);
    }
  };

  const toneColors: Record<string, string> = {
    info: "brand.400",
    success: "green.400",
    warning: "orange.400",
    danger: "red.400",
    neutral: "gray.400",
  };

  const iconColor = toneColors[config.tone] ?? "gray.400";

  return (
    <Box
      px={5}
      py={4}
      borderBottom="1px solid"
      borderColor="borderStructural"
      bg={isUnread ? "rgba(124,58,237,0.06)" : "transparent"}
      _hover={{ bg: "rgba(255,255,255,0.03)" }}
      cursor="pointer"
      onClick={handleClick}
      role="group">
      <HStack align="start" spacing={3}>
        {isSelectionMode && isUnread && (
          <Box mt={1} flexShrink={0}>
            <Box
              w="16px"
              h="16px"
              borderRadius="4px"
              border="1px solid"
              borderColor={isSelected ? "brand.500" : "borderStructural"}
              bg={isSelected ? "brand.500" : "transparent"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all .15s ease">
              {isSelected && <Check size={12} color="white" />}
            </Box>
          </Box>
        )}
        <Box
          mt={1.5}
          w="6px"
          h="6px"
          borderRadius="full"
          bg={isUnread ? "brand.400" : "transparent"}
          flexShrink={0}
        />
        <Box flex={1} minW={0}>
          <HStack spacing={2} align="center">
            <ChakraIcon as={Icon} size={14} color={iconColor} />
            <Text
              fontSize="13px"
              fontWeight={600}
              noOfLines={1}
              color={isUnread ? "textPrimary" : "textSecondary"}>
              {notification.title}
            </Text>
          </HStack>
          <Text fontSize="12px" color="textSecondary" mt={1} noOfLines={3}>
            {notification.message}
          </Text>
          <HStack spacing={1} mt={2}>
            <Text fontSize="10px" color="textMuted" letterSpacing="0.04em">
              {timeAgo(notification.createdAt)}
            </Text>
            <Text fontSize="10px" color="textMuted">
              ·
            </Text>
            <Text
              fontSize="10px"
              color="textMuted"
              textTransform="uppercase"
              letterSpacing="0.04em">
              {config.label}
            </Text>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
}
