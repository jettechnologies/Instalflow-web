import { useAuth } from "@context/auth-provider";
import type { UserRole } from "@utils/types";
import {
  Bell,
  FileText,
  Clock,
  CheckCircle,
  Wallet,
  Banknote,
  UserCog,
  UserCheck,
  UserX,
  FileEdit,
  FileX,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

export interface NotificationTypeConfig {
  icon: typeof Bell;
  tone: "info" | "success" | "warning" | "danger" | "neutral";
  label: string;
  getRoute?: (
    metadata: Record<string, unknown> | null,
    role?: UserRole
  ) => string | null;
}

const isCompanySide = (role?: UserRole) =>
  role === "ADMIN" || role === "COMPANY";

export const NOTIFICATION_TYPE_MAP: Record<string, NotificationTypeConfig> = {
  KYC_APPLICATION_SUBMITTED: {
    icon: FileText,
    tone: "info",
    label: "KYC Application",
    getRoute: (meta, role) => {
      const applicationId = meta?.applicationId as string | undefined;
      const customerName = meta?.customerName as string | undefined;
      if (!applicationId || !customerName) return null;

      return isCompanySide(role)
        ? `/company/applications/${applicationId}/${customerName}`
        : `/marketer/applications/${applicationId}/${customerName}`;
    },
  },
  INSTALLMENT_OVERDUE: {
    icon: Clock,
    tone: "warning",
    label: "Installment Overdue",
    getRoute: (meta) => {
      const installmentId = meta?.installmentId as string | undefined;
      if (installmentId) return `/company/installments/${installmentId}`;
      return null;
    },
  },
  PAYMENT_CONFIRMED: {
    icon: CheckCircle,
    tone: "success",
    label: "Payment Confirmed",
    getRoute: (meta) => {
      const paymentId = meta?.paymentId as string | undefined;
      if (paymentId) return `/customer/payments/${paymentId}`;
      return null;
    },
  },
  COMMISSION_ACCRUED: {
    icon: Wallet,
    tone: "success",
    label: "Commission Accrued",
    getRoute: () => `/marketer/commissions`,
  },
  COMMISSION_TRANSFER_REQUEST: {
    icon: Banknote,
    tone: "info",
    label: "Transfer Request",
    getRoute: (meta) => {
      const requestId = meta?.requestId as string | undefined;
      if (requestId) return `/company/payouts/${requestId}`;
      return null;
    },
  },
  COMMISSION_REQUEST_APPROVAL: {
    icon: CheckCircle,
    tone: "info",
    label: "Approval Required",
    getRoute: (meta, role) => {
      const requestId = meta?.requestId as string | undefined;
      if (!requestId) return null;

      return isCompanySide(role)
        ? `/company/payouts/${requestId}`
        : `/marketer/payouts/${requestId}`;
    },
  },
  INSTALLMENT_REMINDER_3DAY: {
    icon: Bell,
    tone: "info",
    label: "Installment Reminder",
    getRoute: (meta) => {
      const installmentId = meta?.installmentId as string | undefined;
      if (installmentId) return `/customer/installments/${installmentId}`;
      return null;
    },
  },
  INSTALLMENT_DUE_TODAY: {
    icon: Bell,
    tone: "info",
    label: "Due Today",
    getRoute: (meta) => {
      const installmentId = meta?.installmentId as string | undefined;
      if (installmentId) return `/customer/installments/${installmentId}`;
      return null;
    },
  },
  INSTALLMENT_OVERDUE_3DAY: {
    icon: AlertTriangle,
    tone: "warning",
    label: "Overdue Reminder",
    getRoute: (meta) => {
      const customerId = meta?.customerId as string | undefined;
      if (customerId) return `/marketer/customers/${customerId}`;
      return null;
    },
  },
  INSTALLMENT_OVERDUE_7DAY: {
    icon: AlertOctagon,
    tone: "danger",
    label: "Escalation",
    getRoute: (meta) => {
      const installmentId = meta?.installmentId as string | undefined;
      if (installmentId) return `/company/installments/${installmentId}`;
      return null;
    },
  },
  COMMISSION_TRANSFER_INITIATED: {
    icon: Banknote,
    tone: "info",
    label: "Transfer Initiated",
    getRoute: (meta) => {
      const payoutId = meta?.payoutId as string | undefined;
      if (payoutId) return `/marketer/payouts/${payoutId}`;
      return null;
    },
  },
  COMMISSION_TRANSFER_SUCCESS: {
    icon: Banknote,
    tone: "success",
    label: "Transfer Successful",
    getRoute: (meta) => {
      const payoutId = meta?.payoutId as string | undefined;
      if (payoutId) return `/marketer/payouts/${payoutId}`;
      return null;
    },
  },
  COMMISSION_TRANSFER_FAILED: {
    icon: Banknote,
    tone: "danger",
    label: "Transfer Failed",
    getRoute: (meta) => {
      const payoutId = meta?.payoutId as string | undefined;
      if (payoutId) return `/marketer/payouts/${payoutId}`;
      return null;
    },
  },
  COMMISSION_TRANSFER_REVERSED: {
    icon: Banknote,
    tone: "danger",
    label: "Transfer Reversed",
    getRoute: (meta) => {
      const payoutId = meta?.payoutId as string | undefined;
      if (payoutId) return `/marketer/payouts/${payoutId}`;
      return null;
    },
  },
  MARKETER_TOGGLE_REQUEST: {
    icon: UserCog,
    tone: "warning",
    label: "Status Change Request",
    getRoute: (meta) => {
      const marketerId = meta?.marketerId as string | undefined;
      const marketerName = meta?.marketerName as string | undefined;

      if (marketerId && marketerName)
        return `/company/marketers/${marketerId}/${marketerName}`;
      return null;
    },
  },
  MARKETER_DELETE_REQUEST: {
    icon: UserCog,
    tone: "warning",
    label: "Delete Request",
    getRoute: (meta) => {
      const marketerId = meta?.marketerId as string | undefined;
      const marketerName = meta?.marketerName as string | undefined;

      if (marketerId && marketerName)
        return `/company/marketers/${marketerId}/${marketerName}`;
      return null;
    },
  },
  MARKETER_TOGGLE_APPROVED: {
    icon: UserCheck,
    tone: "success",
    label: "Status Approved",
    getRoute: (meta) => {
      const marketerId = meta?.marketerId as string | undefined;
      const marketerName = meta?.marketerName as string | undefined;

      if (marketerId && marketerName)
        return `/company/marketers/${marketerId}/${marketerName}`;
      return null;
    },
  },
  MARKETER_TOGGLE_REJECTED: {
    icon: UserX,
    tone: "danger",
    label: "Status Rejected",
    getRoute: (meta) => {
      const marketerId = meta?.marketerId as string | undefined;
      const marketerName = meta?.marketerName as string | undefined;
      if (marketerId && marketerName)
        return `/company/marketers/${marketerId}/${marketerName}`;
      return null;
    },
  },
  MARKETER_DELETE_APPROVED: {
    icon: UserCheck,
    tone: "success",
    label: "Delete Approved",
    // getRoute: (meta) => {
    //   const marketerId = meta?.marketerId as string | undefined;
    //   const marketerName = meta?.marketerName as string | undefined;
    //   if (marketerId && marketerName)
    //     return `/company/marketers/${marketerId}/${marketerName}`;
    //   return null;
    // },
  },
  MARKETER_DELETE_REJECTED: {
    icon: UserX,
    tone: "danger",
    label: "Delete Rejected",
    getRoute: (meta) => {
      const marketerId = meta?.marketerId as string | undefined;
      const marketerName = meta?.marketerName as string | undefined;
      if (marketerId && marketerName)
        return `/company/marketers/${marketerId}/${marketerName}`;
      return null;
    },
  },
  CONTRACT_RESTRUCTURED: {
    icon: FileEdit,
    tone: "info",
    label: "Contract Updated",
    getRoute: (meta) => {
      const contractId = meta?.contractId as string | undefined;
      if (contractId) return `/marketer/contracts/${contractId}`;
      return null;
    },
  },
  CONTRACT_WRITTEN_OFF: {
    icon: FileX,
    tone: "danger",
    label: "Contract Written Off",
    getRoute: (meta) => {
      const contractId = meta?.contractId as string | undefined;
      if (contractId) {
        const recipientRole = meta?.recipientRole as string | undefined;
        if (recipientRole === "COMPANY" || recipientRole === "ADMIN") {
          return `/company/contracts/${contractId}`;
        }
        return `/marketer/contracts/${contractId}`;
      }
      return null;
    },
  },
};

export const DEFAULT_NOTIFICATION_TYPE: NotificationTypeConfig = {
  icon: Bell,
  tone: "neutral",
  label: "Notification",
  getRoute: () => null,
};

export const getNotificationTypeConfig = (
  type: string
): NotificationTypeConfig => {
  const userRole = useAuth().user?.role as UserRole;
  const config = NOTIFICATION_TYPE_MAP[type] ?? DEFAULT_NOTIFICATION_TYPE;

  return {
    ...config,
    getRoute: config.getRoute
      ? (meta: Record<string, unknown> | null) =>
          config.getRoute!(meta, userRole)
      : undefined,
  };
};
