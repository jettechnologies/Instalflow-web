import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import { Inbox } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
// import { getNotificationsQueryOptions } from "@services/tanstack-queries/notifications";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMarkSelectedNotificationsRead,
} from "@services/tanstack-mutations/notifications";
import { useNavigate } from "@tanstack/react-router";
import { NotificationItem } from "./notification-item";
import { getNotifications } from "@services/queries/notifications";

const PAGE_SIZE = 20;

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.notifications.listInfinite(PAGE_SIZE),
    queryFn: async ({ pageParam }) => {
      const response = await getNotifications(pageParam, PAGE_SIZE);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
  });

  const markAll = useMarkAllNotificationsRead();
  const markSelected = useMarkSelectedNotificationsRead();
  const { mutateAsync: markNotification } = useMarkNotificationRead();

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  const totalUnread = notifications.filter((n) => n.status === "UNREAD").length;

  useEffect(() => {
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop - clientHeight < 80 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleMarkSelected = () => {
    if (selectedIds.length === 0) return;
    markSelected.mutate(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        setIsSelectionMode(false);
      },
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNavigate = useCallback(
    (to: string) => {
      onClose();
      navigate({ to });
    },
    [navigate, onClose]
  );

  const handleMarkRead = useCallback(async (id: string) => {
    await markNotification(id);
  }, []);

  const handleMarkAll = () => {
    markAll.mutate(undefined, {
      onSuccess: () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
      },
    });
  };

  return (
    <VStack align="stretch" spacing={0}>
      <Flex
        justify="space-between"
        align="center"
        px={5}
        py={3}
        borderBottom="1px solid"
        borderColor="borderStructural">
        <Box>
          <Text fontSize="16px" fontWeight={700}>
            Notifications
          </Text>
          <Text fontSize="11px" color="textMuted" mt={1}>
            {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
          </Text>
        </Box>
        <HStack spacing={2} mr={6}>
          {isSelectionMode ? (
            <>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedIds([]);
                }}>
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={handleMarkSelected}
                isDisabled={selectedIds.length === 0}
                isLoading={markSelected.isPending}
                loadingText="Marking...">
                Mark selected read
              </Button>
            </>
          ) : (
            <>
              <Button
                size="xs"
                variant="ghost"
                color="textSecondary"
                onClick={() => setIsSelectionMode(true)}
                isDisabled={totalUnread === 0}>
                Select
              </Button>
              <Button
                size="xs"
                variant="ghostOutline"
                onClick={handleMarkAll}
                isDisabled={totalUnread === 0}
                isLoading={markAll.isPending}
                loadingText="Marking...">
                Mark all read
              </Button>
            </>
          )}
        </HStack>
      </Flex>

      <Box
        ref={scrollRef}
        overflowY="auto"
        px={0}
        py={0}
        onScroll={handleScroll}
        height="full">
        {isLoading ? (
          <VStack py={8} px={4} spacing={3} w="full">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                px={5}
                py={4}
                w="full"
                border="1px solid"
                borderColor="borderStructural"
                borderRadius="md"
                bg="bgLayer2">
                <Skeleton
                  height="12px"
                  width="60%"
                  mb={3}
                  borderRadius="4px"
                  startColor="rgba(255,255,255,0.06)"
                  endColor="rgba(255,255,255,0.12)"
                />

                <Skeleton
                  height="10px"
                  width="90%"
                  borderRadius="4px"
                  startColor="rgba(255,255,255,0.04)"
                  endColor="rgba(255,255,255,0.08)"
                />
              </Box>
            ))}
          </VStack>
        ) : isError ? (
          <Flex direction="column" align="center" py={12} gap={3}>
            <Text fontSize="13px" color="textSecondary">
              Couldn't load notifications.
            </Text>
            <Button size="xs" variant="ghostOutline" onClick={() => refetch()}>
              Retry
            </Button>
          </Flex>
        ) : notifications.length === 0 ? (
          <VStack py={12} spacing={3}>
            <Inbox size={32} color="#475467" />
            <Text fontSize="13px" color="textSecondary">
              You're all caught up
            </Text>
            <Text fontSize="11px" color="textMuted">
              New notifications will show up here.
            </Text>
          </VStack>
        ) : (
          <VStack spacing={0} align="stretch">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.includes(notification.notificationId)}
                onToggleSelect={handleToggleSelect}
                onMarkRead={handleMarkRead}
                onNavigate={handleNavigate}
              />
            ))}
            {isFetchingNextPage && (
              <Flex justify="center" py={3}>
                <Spinner size="sm" color="brand.400" />
              </Flex>
            )}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
