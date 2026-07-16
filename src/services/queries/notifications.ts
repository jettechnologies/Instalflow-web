import { apiService } from "@services/api-service";
import type {
  InternalNotification,
  NotificationsPage,
  UnreadCountResponse,
} from "@utils/types/notification";

export const getNotifications = (page: number, limit: number) => {
  return apiService.get<NotificationsPage>("/notifications", {
    page: String(page),
    limit: String(limit),
  });
};

export const getUnreadCount = () => {
  return apiService.get<UnreadCountResponse>("/notifications/unread-count");
};
