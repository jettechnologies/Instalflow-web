import { apiService } from "@services/api-service";
import type {
  MarkReadResponse,
  MarkSelectedReadResponse,
  MarkAllReadResponse,
} from "@utils/types/notification";

export const markNotificationRead = async (notificationId: string) => {
  return await apiService.patch<MarkReadResponse>(
    `/notifications/${notificationId}/read`
  );
};

export const markSelectedNotificationsRead = async (
  notificationIds: string[]
) => {
  return await apiService.patch<MarkSelectedReadResponse>(
    "/notifications/read-selected",
    { notificationIds }
  );
};

export const markAllNotificationsRead = async () => {
  return await apiService.patch<MarkAllReadResponse>("/notifications/read-all");
};
