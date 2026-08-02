import type { PaginatedData } from "@services/api-service";

export type InstallmentStatus =
  | "PENDING"
  | "DUE"
  | "DUE_SOON"
  | "OVERDUE"
  | "PAID"
  | "UPCOMING";

export interface CustomerProductImage {
  imageId: string;
  productId: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  cloudinaryPublicId: string | null;
  createdAt: string;
}

export interface CustomerProduct {
  productId: string;
  companyId: string;
  name: string;
  slug: string;
  description: string | null;
  minPrice: string;
  maxPrice: string;
  stockQuantity: number;
  price: string;
  commissionRate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  images: CustomerProductImage[];
}

export interface CustomerProductOwner {
  userId: string;
  name: string;
  email: string;
}

export interface CustomerKycApplication {
  kycApplicationId: string;
  userId: string;
  onboardingSessionId: string;
  productId: string;
  installmentPlanId: string;
  variantId: string;
  idType: string;
  idNumber: string;
  status: string;
  marketerApproved: boolean;
  marketerApprovedAt: string | null;
  adminApproved: boolean;
  adminApprovedAt: string | null;
  rejectionReason: string | null;
  legalHold: boolean;
  isUnderFraudReview: boolean;
  createdAt: string;
  updatedAt: string;
  product: CustomerProduct;
  user: CustomerProductOwner;
}

export interface CustomerFinancingContract {
  contractId: string;
  totalFinanced: string;
  status: string;
  activatedAt: string | null;
  completedAt: string | null;
  kycApplication: CustomerKycApplication;
}

export interface CustomerInstallmentPayment {
  paymentId: string;
  installmentId: string;
  amount: string;
  reference: string;
  provider: string;
  status: string;
  createdAt: string;
}

export interface CustomerInstallment {
  installmentId: string;
  financingContractId: string;
  dueDate: string;
  amount: string;
  sequence: number;
  status: InstallmentStatus;
  paidAt: string | null;
  overdueAt: string | null;
  createdAt: string;
  updatedAt: string;
  financingContract: CustomerFinancingContract;
  payments: CustomerInstallmentPayment[];
}

export type PaginatedCustomerInstallments = PaginatedData<
  "installments",
  CustomerInstallment
>;

export interface InstallmentPaymentResult {
  authorization_url: string;
  access_code: string;
  reference: string;
  amount: number;
  installmentId: string;
  dueDate: string;
  message?: string;
  isExisting?: boolean;
}
