import type { UserRole } from "./auth";
import { APPROVAL_STATUS } from "../misc";

export type ApprovalAction = "TOGGLE_ACTIVE" | "DELETE_ACCOUNT";
export type UserActions = "TOGGLE_STATUS" | "DELETE_ACCOUNT";
export type ApprovalStatus = (typeof APPROVAL_STATUS)[number];
export type ReviewAction = Exclude<ApprovalStatus, "PENDING">;

type InviteMarketerType = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  forcePasswordChange: string;
  referralCode: string;
};

type CreateAdminType = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  referralCode: string;
};

export type InviteMarketerResponse = {
  user: InviteMarketerType;
  tempPassword: string;
  instructions: string;
};

export type CreateAdminResponse = {
  user: CreateAdminType;
  tempPassword: string;
  instructions: string;
};

export interface AdminUserResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    createdUsers: number;
    requestedApprovals: number;
  };
  marketerCount: number;
}

export interface AdminStats {
  marketerCount: number;
  customerCount: number;
  financingContractCount: number;
  totalCommissionGenerated: number;
  totalCommissionRecords: number;
}

export interface CreatedMarketer {
  userId: string;
  name: string;
  email: string;
  active: boolean;
  referralCode: string;
  createdAt: string;
  _count: {
    referredUsers: number;
  };
}

export interface DetailedAdminResponse {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdUsers: CreatedMarketer[];
  stats: AdminStats;
}

export interface MarketerUserResponse {
  userId: string;
  name: string;
  email: string;
  role: "MARKETER";
  active: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    referredUsers: number;
  };
}

export interface Creator {
  userId: string;
  name: string;
  email: string;
  role: "COMPANY" | string;
}

export interface MarketerStats {
  referredCustomers: number;
  approvedKycApplications: number;
  financingContracts: number;
  totalFinancedVolume: number;
  totalCommissionGenerated: number;
  totalCommissionRecords: number;
  totalPayoutRequested: number;
  totalPayoutRequests: number;
}

export interface RecentCustomer {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export type ComissionPayoutRequestStatus =
  | "PENDING_ADMIN_APPROVAL"
  | "PENDING_COMPANY_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "TRANSFER_INITIATED"
  | "PAID"
  | "TRANSFER_FAILED"
  | "TRANSFER_REVERSED";

export interface RecentPayoutRequest {
  payoutId: string;
  amount: number;
  status: ComissionPayoutRequestStatus;
  requestedAt: string;
}

export interface MarketerBankAccount {
  accountId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface DetailedMarketerResponse {
  userId: string;
  name: string;
  email: string;
  role: "MARKETER";
  active: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  marketerBankAccounts: MarketerBankAccount[];
  _count: {
    referredUsers: number;
  };
  stats: MarketerStats;
  recentCustomers: RecentCustomer[];
  recentPayoutRequests: RecentPayoutRequest[];
}

export interface MarketerStatusResponse {
  requestId: string;
  action: "TOGGLE_ACTIVE" | "SOFT_DELETE";
  status: ApprovalStatus;
  createdAt: string;
}
export interface AdminStatusResponse {
  userId: string;
  name: string;
  active: boolean;
  email: string;
}

export interface ApprovalRequestUser {
  userId: string;
  name: string;
  email: string;
}

export interface ApprovalTargetUser {
  userId: string;
  name: string;
  email: string;
  active: boolean;
}

export interface ApprovalRequest {
  requestId: string;
  companyId: string;
  requestedById: string;
  targetUserId: string;
  action: ApprovalAction;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  reviewReason?: string;
  reviewedAt?: string;
  requestedBy: ApprovalRequestUser;
  targetUser: ApprovalTargetUser;
}
