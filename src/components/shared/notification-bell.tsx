import { useDisclosure } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { getUnreadCountQueryOptions } from "@services/tanstack-queries/notifications";
import { NotificationPanel } from "./notifications/notification-panel";

export function NotificationBell() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: unreadCount = 0 } = useQuery(getUnreadCountQueryOptions());

  return (
    <>
      <Box position="relative" display="inline-flex">
        <IconButton
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          icon={<Bell size={18} />}
          variant="ghost"
          color="textSecondary"
          _hover={{ color: "textPrimary", bg: "rgba(255,255,255,0.04)" }}
          onClick={onOpen}
        />
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="6px"
            right="6px"
            minW="16px"
            h="16px"
            px="4px"
            borderRadius="full"
            bg="statusDanger"
            color="white"
            fontSize="10px"
            fontWeight={700}
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
            lineHeight="1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Box>
        )}
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay backdropFilter="blur(6px)" />
        <DrawerContent
          bg="bgLayer2"
          borderLeft="1px solid"
          borderColor="borderStructural">
          <DrawerCloseButton color="textSecondary" />
          <NotificationPanel onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
