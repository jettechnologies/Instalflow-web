import type { OverviewSearchType } from "@utils/schema";
import type { UrlParams } from "./api-service";
import type { ApprovalParams } from "./queries/staff-management";

export const QUERY_KEYS = {
  admin_management: {
    base: () => ["admin"],
    all: (params: Partial<UrlParams>) => [
      ...QUERY_KEYS.admin_management.base(),
      "all",
      params,
    ],
    details: (adminId: string) => [
      ...QUERY_KEYS.admin_management.base(),
      "details",
      adminId,
    ],
    marketerCreatedByAdmins: (adminId: string, params: Partial<UrlParams>) => [
      ...QUERY_KEYS.marketer_management.base(),
      "admin-created",
      adminId,
      params,
    ],
  },
  marketer_management: {
    base: () => ["marketer"],
    all: (params: Partial<UrlParams>) => [
      ...QUERY_KEYS.marketer_management.base(),
      "all",
      params,
    ],
    details: (adminId: string) => [
      ...QUERY_KEYS.marketer_management.base(),
      "details",
      adminId,
    ],
    approval_requests: (params: Partial<ApprovalParams>) => [
      ...QUERY_KEYS.marketer_management.base(),
      "approval_requests",
      params,
    ],
  },
  products: {
    base: () => ["products"],
    all: (params?: any) => [...QUERY_KEYS.products.base(), "all", params],
    single: (id: string) => [...QUERY_KEYS.products.base(), "single", id],
    details: (productId: string) => [
      ...QUERY_KEYS.products.base(),
      "details",
      productId,
    ],
    gallery: (productId: string) => [
      ...QUERY_KEYS.products.base(),
      "gallery",
      productId,
    ],
    installmentPlans: (productId: string) => [
      ...QUERY_KEYS.products.base(),
      "installment-plans",
      productId,
    ],
    bySlug: (slug: string) => [...QUERY_KEYS.products.base(), "by-slug", slug],
  },
  categories: {
    base: () => ["categories"],
    all: () => [...QUERY_KEYS.categories.base(), "all"],
    details: (categoryId: string) => [
      ...QUERY_KEYS.categories.base(),
      "details",
      categoryId,
    ],
  },
  installments: {
    base: () => ["installments"],
    customer: (params?: OverviewSearchType) => [
      ...QUERY_KEYS.installments.base(),
      "customer",
      params,
    ],
    detail: (installmentId: string) => [
      ...QUERY_KEYS.installments.base(),
      "detail",
      installmentId,
    ],
    contract: (id: string) => [
      ...QUERY_KEYS.installments.base(),
      "contract",
      id,
    ],
    progress: (id: string) => [
      ...QUERY_KEYS.installments.base(),
      "progress",
      id,
    ],
  },
  commissions: {
    base: () => ["commissions"],
    pending: () => [...QUERY_KEYS.commissions.base(), "pending"],
    allTime: () => [...QUERY_KEYS.commissions.base(), "all-time"],
  },
  ledger: {
    base: () => ["ledger"],
    analytics: () => [...QUERY_KEYS.ledger.base(), "analytics"],
  },
  plans: {
    base: () => ["subscription_plans"],
    all: () => [...QUERY_KEYS.plans.base(), "all"],
  },
  marketer: {
    base: () => ["marketer"],
    products: () => [...QUERY_KEYS.marketer.base(), "products"],
    links: () => [...QUERY_KEYS.marketer.base(), "links"],
  },
  kyc: {
    base: () => ["kyc"],
    all: (params: any) => [...QUERY_KEYS.kyc.base(), "all", params],
    detail: (id: string) => [...QUERY_KEYS.kyc.base(), "detail", id],
    document: (id: string) => [...QUERY_KEYS.kyc.base(), "document", id],
  },
  notifications: {
    base: () => ["notifications"],
    list: (page: number, limit: number) => [
      ...QUERY_KEYS.notifications.base(),
      "list",
      page,
      limit,
    ],
    listInfinite: (limit: number) => [
      ...QUERY_KEYS.notifications.base(),
      "list",
      limit,
    ],
    unreadCount: () => [...QUERY_KEYS.notifications.base(), "unread-count"],
  },
};
