import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Bell, Inbox } from "lucide-react";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function NotificationBell() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const count = 5;
  const isLoading = false;

  const notificationList = [
    {
      id: "notif-1",
      status: "UNREAD",
      title: "Security Alert",
      message:
        "A new login was detected from a device you don't usually use. Please review this activity immediately to secure your account.",
      createdAt: "2026-06-16T09:30:00Z",
      type: "SECURITY_ALERT",
    },
    {
      id: "notif-2",
      status: "READ",
      title: "System Update",
      message:
        "Your workspace has been successfully updated to the latest version. Check out the changelog to see all the new features.",
      createdAt: "2026-06-15T14:15:00Z",
      type: "SYSTEM_NOTIFICATION",
    },
  ];

  return (
    <>
      <Box position="relative">
        <IconButton
          aria-label="Notifications"
          icon={<Bell size={18} />}
          variant="ghost"
          color="textSecondary"
          _hover={{ color: "textPrimary", bg: "rgba(255,255,255,0.04)" }}
          onClick={onOpen}
        />
        {count ? (
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
            pointerEvents="none">
            {count > 9 ? "9+" : count}
          </Box>
        ) : null}
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay backdropFilter="blur(6px)" />
        <DrawerContent
          bg="bgLayer2"
          borderLeft="1px solid"
          borderColor="borderStructural">
          <DrawerCloseButton color="textSecondary" />
          <DrawerHeader borderBottom="1px solid" borderColor="borderStructural">
            <Flex align="center" justify="space-between" pr={8}>
              <Box>
                <Text fontSize="16px" fontWeight={700}>
                  Notifications
                </Text>
                <Text fontSize="11px" color="textMuted" mt={1}>
                  {count ? `${count} unread` : "All caught up"}
                </Text>
              </Box>
              <Button
                size="xs"
                variant="ghostOutline"
                onClick={() => console.log("Mark all read")}
                isDisabled={false}>
                Mark all read
              </Button>
            </Flex>
          </DrawerHeader>
          <DrawerBody px={0} py={0}>
            {isLoading ? (
              <Flex justify="center" py={16}>
                <Spinner color="brand.400" />
              </Flex>
            ) : (notificationList?.length ?? 0) === 0 ? (
              <VStack py={16} spacing={3}>
                <Inbox size={32} color="#475467" />
                <Text fontSize="13px" color="textSecondary">
                  No notifications yet.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={0} align="stretch">
                {notificationList!.map((n) => (
                  <Box
                    key={n.id}
                    px={5}
                    py={4}
                    borderBottom="1px solid"
                    borderColor="borderStructural"
                    bg={
                      n.status === "UNREAD"
                        ? "rgba(124,58,237,0.06)"
                        : "transparent"
                    }
                    _hover={{ bg: "rgba(255,255,255,0.03)" }}
                    cursor="pointer"
                    onClick={() =>
                      //   n.status === "UNREAD" && markOne.mutate(n.id)
                      console.log("Mark as Unread")
                    }>
                    <HStack align="start" spacing={3}>
                      {n.status === "UNREAD" && (
                        <Box
                          mt={1.5}
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg="brand.400"
                          flexShrink={0}
                        />
                      )}
                      <Box flex={1} minW={0}>
                        <Text fontSize="13px" fontWeight={600} noOfLines={1}>
                          {n.title}
                        </Text>
                        <Text
                          fontSize="12px"
                          color="textSecondary"
                          mt={1}
                          noOfLines={3}>
                          {n.message}
                        </Text>
                        <Text
                          fontSize="10px"
                          color="textMuted"
                          mt={2}
                          letterSpacing="0.04em">
                          {timeAgo(n.createdAt)} · {n.type.replace(/_/g, " ")}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
