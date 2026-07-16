import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import { getNotifications, getUnreadCount } from "@services/queries/notifications";

export const getNotificationsQueryOptions = (page: number, limit: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.notifications.list(page, limit),
    queryFn: async () => {
      const response = await getNotifications(page, limit);
      return response.data;
    },
  });

export const getUnreadCountQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.notifications.unreadCount(),
    queryFn: async () => {
      const response = await getUnreadCount();
      return response.data.unreadCount;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
