import type { UserRole } from "./auth";
import { APPROVAL_STATUS } from "../misc";
import type { PaginatedData } from "@services/api-service";

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

export type Category = {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
export interface ProductImage {
  imageId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string | null;
  productId: string;
  cloudinaryPublicId?: string;
  createdAt: string;
}

export interface VariantImage {
  variantId: string;
  imageId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  image: ProductImage;
}

export interface ProductImageDetail extends ProductImage {
  variants?: { variantId: string; sku: string }[];
}
export interface Variant {
  variantId: string;
  sku: string;
  price: number;
  stockQuantity: number;
  size: string;
  color: string[];
  attributes?: Record<string, any>;
  images: VariantImage[];
  isActive: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstallmentPlan {
  planId: string;
  durationMonths: number;
  interestPercentage: number;
  active: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = "DRAFT" | "PUBLISHED" | "SOLD_OUT" | "ARCHIVED";
export interface Product {
  productId: string;
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  category?: Category;
  commissionRate: number;
  status: ProductStatus;
  price: number;
  stockQuantity: number;
  minPrice?: number;
  maxPrice?: number;
  variants: Variant[];
  images: ProductImage[];
  installmentPlans: InstallmentPlan[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemVariantSchema {
  sku: string;
  size: string;
  color: string[];
  stockQuantity: number;
  price: number;
}
export interface SystemProductDef {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  commissionRate: number;
  variants: ItemVariantSchema[];
}

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";
export type KycOnboardingStatus =
  | "PENDING_KYC"
  | "KYC_SUBMITTED"
  | "APPROVED"
  | "EXPIRED"
  | "EXPIRING"
  | "CANCELLED";

export interface ReferredByMarketer {
  name: string;
  email: string;
}

export interface KycUser {
  userId: string;
  name: string;
  email: string;
  referredByMarketerId: string | null;
  referredByMarketer: ReferredByMarketer | null;
}

export interface KycProduct {
  productId: string;
  name: string;
  slug: string;
  commissionRate: string;
}

export interface FinancingContract {
  contractId: string;
  status: string;
  totalFinanced: string;
}

export interface KycDocumentAsset {
  assetId: string;
  fileSize: number;
  mimeType: string;
  scheduledDeletionAt: string | null;
}

export interface OnboardingSession {
  sessionId: string;
  name: string;
  email: string;
  passwordHash: string;
  marketerId: string;
  companyId: string;
  status: string;
  expiresAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  marketer: OnboardingMarketer;
  company: OnboardingCompany;
}
export interface OnboardingMarketer {
  userId: string;
  name: string;
  email: string;
  referralCode: string;
  createdById: string | null;
}
export interface OnboardingCompany {
  companyId: string;
  name: string;
}

export interface KycApplication {
  kycApplicationId: string;
  userId: string;
  productId: string;
  installmentPlanId: string;
  variantId: string;
  idType: string;
  idNumber: string;
  status: KycStatus;
  marketerApproved: boolean;
  marketerApprovedAt: string | null;
  adminApproved: boolean;
  adminApprovedAt: string | null;
  rejectionReason: string | null;
  legalHold: boolean;
  isUnderFraudReview: boolean;
  createdAt: string;
  updatedAt: string;
  onboardingSession: OnboardingSession;
  user: KycUser;
  product: KycProduct;
  financingContract: FinancingContract | null;
  kycDocumentAssets: KycDocumentAsset[];
}

export interface PaginatedKycApplications
  extends PaginatedData<"applications", KycApplication> {}
