import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import { QUERY_KEYS } from "@services/query-keys";
import {
  markAllNotificationsRead,
  markNotificationRead,
  markSelectedNotificationsRead,
} from "@services/mutations/notifications";
import type { NotificationsPage } from "@utils/types/notification";

export const useMarkNotificationRead = () => {
  const { openToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousListData = queryClient
        .getQueriesData<InfiniteData<NotificationsPage>>({
          queryKey: ["notifications", "list"],
        })
        .filter(([, data]) => data !== undefined);

      const previousUnreadCount = queryClient.getQueryData<number>(
        QUERY_KEYS.notifications.unreadCount()
      );

      queryClient.setQueriesData<InfiniteData<NotificationsPage>>(
        { queryKey: ["notifications", "list"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((n) =>
                n.notificationId === notificationId
                  ? { ...n, status: "READ" as const }
                  : n
              ),
            })),
          };
        }
      );

      if (previousUnreadCount !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.notifications.unreadCount(),
          Math.max(0, previousUnreadCount - 1)
        );
      }

      return { previousListData, previousUnreadCount };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.previousListData?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (ctx?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(
          QUERY_KEYS.notifications.unreadCount(),
          ctx.previousUnreadCount
        );
      }
    },
    onSuccess: (data) => {
      const message =
        data?.message || "Notification marked as read successfully";

      openToast(message, "success");
    },
    meta: {
      invalidatesQuery: QUERY_KEYS.notifications.base(),
    },
  });
};

export const useMarkSelectedNotificationsRead = () => {
  const { openToast } = useToastContext();

  return useMutation({
    mutationFn: markSelectedNotificationsRead,
    meta: {
      invalidatesQuery: QUERY_KEYS.notifications.base(),
    },
    onSuccess: (data) => {
      const message =
        data?.message || "Selected notifications marked as read successfully";

      openToast(message, "success");
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const { openToast } = useToastContext();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    meta: {
      invalidatesQuery: QUERY_KEYS.notifications.base(),
    },
    onSuccess: (data) => {
      const message =
        data?.message || "All notifications marked as read successfully";

      openToast(message, "success");
    },
  });
};
