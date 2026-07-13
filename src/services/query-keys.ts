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
    customer: (page?: number) => [
      ...QUERY_KEYS.installments.base(),
      "customer",
      page,
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
};

// export interface SearchEndpointParams {
//   keyword: string;
//   page?: number;
//   signal?: AbortSignal;
// }

// export interface WalletTransactionParams {
//   type: string;
//   page: number;
//   startDate?: string;
//   endDate?: string;
//   limit?: number;
// }

// export interface SingleCustomerTicketsParams {
//   customerId: string;
//   page?: number;
// }

// export interface FilterTransactionParams {
//   status?: string;
//   page?: number;
// }

// export interface TransactionTypeDateRangeParams {
//   type: string;
//   startDate: string;
//   endDate: string;
// }

// export interface FilterTransferTransactionParams {
//   status?: string;
//   page?: number;
// }

// export interface AllTransfersParams {
//   type: string;
//   page?: number;
// }

// export interface FilterSavingParams {
//   savingType: string;
//   page?: number;
// }

// export interface PersonalSavingsFilterParams {
//   userId: string;
//   page?: number;
// }

// export interface FilterInvoiceParams {
//   status: string;
//   page?: number;
// }

// export const QUERY_KEYS = {
//   self: {
//     all: () => ["self"],
//   },
//   transaction: {
//     all: (page?: number) => ["transaction", "all", page],
//     single: (id: string) => ["transaction", "single", id],
//     "filter-transactions": (params: FilterTransactionParams) => [
//       "transaction",
//       "filter-transactions",
//       params,
//     ],
//     "filter-transactions-type-dateRange": (
//       params: TransactionTypeDateRangeParams
//     ) => ["transaction", "filter-transactions-type-dateRange", params],
//   },
//   transfers: {
//     all: (page?: number) => ["transfers", "all", page],
//     single: (id: string) => ["transfers", "single", id],
//     "filter-transfers": (params: FilterTransferTransactionParams) => [
//       "transfers",
//       "filter-transactions",
//       params,
//     ],
//     "filter-transfers-type": (params: AllTransfersParams) => [
//       "transfers",
//       "filter-transactions-type",
//       params,
//     ],
//   },
//   bills: {
//     all: (page?: number) => ["bills", "all", page],
//     single: (id: string) => ["bills", "single", id],
//     "filter-bills": () => ["bills", "filter-transactions"],
//   },
//   savings: {
//     all: (page?: number) => ["savings", "all", page],
//     single: (id: string) => ["savings", "single", id],
//     "search-savings": (params: SearchEndpointParams) => [
//       "savings",
//       "search-savings",
//       params,
//     ],
//     "filter-by-savingType": (params: FilterSavingParams) => [
//       "savings",
//       "filter-by-savingType",
//       params,
//     ],
//     "personal-savings-filter": (params: PersonalSavingsFilterParams) => [
//       "savings",
//       "personal-savings-filter",
//       params,
//     ],
//   },
//   customers: {
//     base: () => ["customers"],
//     all: (page?: number) => [...QUERY_KEYS.customers.base(), "all", page],
//     single: (id?: string) => [...QUERY_KEYS.customers.base(), "single", id],
//     "search-customers": (params: SearchEndpointParams) => [
//       ...QUERY_KEYS.customers.base(),
//       "filter-customers",
//       params,
//     ],
//   },
//   invoice: {
//     base: () => ["invoice"],
//     all: (page?: number) => [...QUERY_KEYS.invoice.base(), "all", page],
//     single: (id?: string) => [...QUERY_KEYS.invoice.base(), "single", id],
//     "search-invoice": (params: SearchEndpointParams) => [
//       ...QUERY_KEYS.customers.base(),
//       "search-invoice",
//       params,
//     ],
//     "filter-invoice": (params: FilterInvoiceParams) => [
//       ...QUERY_KEYS.customers.base(),
//       "filter-invoice",
//       params,
//     ],
//   },
//   tickets: {
//     base: () => ["tickets"],
//     all: (page?: number) => [...QUERY_KEYS.tickets.base(), "all", page],
//     "single-ticket": (id?: string) => [
//       ...QUERY_KEYS.tickets.base(),
//       "single",
//       id,
//     ],
//     "single-customer-tickets": (params: SingleCustomerTicketsParams) => [
//       ...QUERY_KEYS.tickets.base(),
//       "single-customer-tickets",
//       params,
//     ],
//     "search-tickets": (params: SearchEndpointParams) => [
//       ...QUERY_KEYS.tickets.base(),
//       "search-tickets",
//       params,
//     ],
//   },
//   teams: {
//     base: () => ["teams"],
//     all_permissions: (page?: number) => [
//       ...QUERY_KEYS.teams.base(),
//       "all-permissions",
//       page,
//     ],
//     all_roles: (page?: number) => [
//       ...QUERY_KEYS.teams.base(),
//       "all-roles",
//       page,
//     ],
//     all_teamMembers: (page?: number) => [
//       ...QUERY_KEYS.teams.base(),
//       "all-teamMembers",
//       page,
//     ],
//     "single-permission": (id?: string) => [
//       ...QUERY_KEYS.teams.base(),
//       "single-permission",
//       id,
//     ],
//     "single-role": (id?: string) => [
//       ...QUERY_KEYS.teams.base(),
//       "single-role",
//       id,
//     ],
//     "single-team": (id?: string) => [
//       ...QUERY_KEYS.teams.base(),
//       "single-team",
//       id,
//     ],
//     "single-teamMember": (id?: string) => [
//       ...QUERY_KEYS.teams.base(),
//       "all-teamMembers",
//       id,
//     ],
//   },
//   dashboard: {
//     base: () => ["dashboard"],
//     overview: () => [...QUERY_KEYS.dashboard.base(), "overview"],
//     transactions_overview: () => [
//       ...QUERY_KEYS.dashboard.base(),
//       "transactions",
//     ],
//   },
//   revenue: {
//     base: () => ["revenue"],
//     all_wallets: () => [...QUERY_KEYS.revenue.base(), "all-wallets"],
//     single_wallet: (type: string) => [
//       ...QUERY_KEYS.revenue.base(),
//       "single-wallet",
//       type,
//     ],
//     wallet_transactions: ({
//       type,
//       page,
//       startDate,
//       endDate,
//     }: Omit<WalletTransactionParams, "limit">) => [
//       ...QUERY_KEYS.revenue.base(),
//       "wallet-transactions",
//       type,
//       page,
//       startDate,
//       endDate,
//     ],
//   },
//   dashboard_summary: {
//     base: () => ["dashboard_summary"],
//     transfers: () => [...QUERY_KEYS.dashboard_summary.base(), "transfers"],
//     virtual_account_funding: () => [
//       ...QUERY_KEYS.dashboard_summary.base(),
//       "virtual-account-funding",
//     ],
//     money_requests: () => [
//       ...QUERY_KEYS.dashboard_summary.base(),
//       "money-requests",
//     ],
//     bills: () => [...QUERY_KEYS.dashboard_summary.base(), "bills"],
//     personal_savings: () => [
//       ...QUERY_KEYS.dashboard_summary.base(),
//       "personal-savings",
//     ],
//     group_savings: () => [
//       ...QUERY_KEYS.dashboard_summary.base(),
//       "group-savings",
//     ],
//     wallets: () => [...QUERY_KEYS.dashboard_summary.base(), "wallets"],
//     ticket_summary: () => [
//       ...QUERY_KEYS.dashboard_summary.base(),
//       "ticket-summary",
//     ],
//     single_ticket_summary: (ticketId: string) => [
//       ...QUERY_KEYS.dashboard_summary.ticket_summary(),
//       ticketId,
//     ],
//   },
//   supportedBank: {
//     base: () => ["supportedBank"],
//   },
//   // Instalflow Ledger domains addition
// plans: {
//   base: () => ["plans"],
//   all: () => [...QUERY_KEYS.plans.base(), "all"],
// },
// products: {
//   base: () => ["products"],
//   all: (page?: number) => [...QUERY_KEYS.products.base(), "all", page],
//   single: (id: string) => [...QUERY_KEYS.products.base(), "single", id],
// },
// installments: {
//   base: () => ["installments"],
//   customer: (page?: number) => [
//     ...QUERY_KEYS.installments.base(),
//     "customer",
//     page,
//   ],
//   contract: (id: string) => [
//     ...QUERY_KEYS.installments.base(),
//     "contract",
//     id,
//   ],
//   progress: (id: string) => [
//     ...QUERY_KEYS.installments.base(),
//     "progress",
//     id,
//   ],
// },
// commissions: {
//   base: () => ["commissions"],
//   pending: () => [...QUERY_KEYS.commissions.base(), "pending"],
//   allTime: () => [...QUERY_KEYS.commissions.base(), "all-time"],
// },
// ledger: {
//   base: () => ["ledger"],
//   analytics: () => [...QUERY_KEYS.ledger.base(), "analytics"],
// },
// };
