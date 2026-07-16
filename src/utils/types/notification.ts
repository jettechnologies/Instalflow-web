export interface InternalNotification {
  notificationId: string;
  userId: string;
  type: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  idempotencyKey?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationsPage {
  notifications: InternalNotification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkReadResponse {
  success: boolean;
}

export interface MarkSelectedReadResponse {
  updated: number;
}

export interface MarkAllReadResponse {
  updated: number;
}
