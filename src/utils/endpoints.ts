const staffManagement = {
  marketer: {
    inviteMarketer: "/auth/marketers",
    getAllMarketers: "/admin/marketers",
    getAllApprovals: "/company/approvals",
    getPendingApprovals: "/company/pending-approvals",
    getSingleMarketer: (marketerId: string) => `/admin/marketers/${marketerId}`,
    requestMarketerStatusToggle: (marketerId: string) =>
      `/admin/marketers/${marketerId}/request-toggle`,
    requestMarketerDelete: (marketerId: string) =>
      `/admin/marketers/${marketerId}/request-delete`,
    softDeleteMarketer: (marketerId: string) =>
      `/company/marketers/${marketerId}`,
    toggleMarketerStatus: (marketerId: string) =>
      `/company/marketers/${marketerId}/toggle-status`,
    handleApprovalRequest: (requestId: string) =>
      `/company/approvals/${requestId}`,
  },
  admin: {
    createAdmin: "/company/admins",
    getAllAdmin: "/company/admins",
    getSingleAdmin: (adminId: string) => `/company/admins/${adminId}`,
    getAdminsMarketers: (adminId: string) =>
      `/company/admins/${adminId}/marketers`,
    softDeleteAdmin: (adminId: string) => `/company/admins/${adminId}`,
    toggleAdminStatus: (adminId: string) => `/company/admins/${adminId}/status`,
  },
};

const kyc = {
  base: "/kyc/applications",
  detail: (applicationId: string) => `/kyc/applications/${applicationId}`,
  approve: (applicationId: string) =>
    `/kyc/applications/${applicationId}/approve`,
  reject: (applicationId: string) =>
    `/kyc/applications/${applicationId}/reject`,
  document: (applicationId: string) =>
    `/kyc/applications/${applicationId}/document`,
};

const catalog = {
  products: {
    base: "/products",
    details: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/slug/${slug}`,
    bulkCreate: "/products/bulk",
    search: "/products/search",
    cursor: "/products/cursor",
  },
  gallery: {
    base: (productId: string) => `/products/${productId}/gallery`,
    reorder: (productId: string) => `/products/${productId}/gallery/reorder`,
    primary: (productId: string, imageId: string) =>
      `/products/${productId}/gallery/${imageId}/primary`,
    metadata: (productId: string, imageId: string) =>
      `/products/${productId}/gallery/${imageId}`,
  },
  variants: {
    base: (productId: string) => `/variants/${productId}`,
    bulk: (productId: string) => `/variants/${productId}/bulk`,
    details: (variantId: string) => `/variants/${variantId}`,
    stock: (variantId: string) => `/variants/${variantId}/stock`,
    status: (variantId: string) => `/variants/${variantId}/status`,
    images: (variantId: string) => `/variants/${variantId}/images`,
  },
  installmentPlans: {
    base: (productId: string) => `/products/${productId}/installment-plans`,
    details: (planId: string) => `/installment-plans/${planId}`,
    status: (planId: string) => `/installment-plans/${planId}/status`,
  },
  categories: {
    base: "/categories",
    details: (id: string) => `/categories/${id}`,
  },
};

const installments = {
  customer: "/installments/customer",
  view: (installmentId: string) => `/installments/view/${installmentId}`,
  pay: (installmentId: string) => `/installments/${installmentId}/pay`,
  contract: (contractId: string) => `/installments/${contractId}`,
  financedProducts: (contractId: string) =>
    `/installments/${contractId}/products`,
  progress: (contractId: string) => `/installments/${contractId}/progress`,
};

export const ENDPOINTS = {
  staffManagement,
  kyc,
  catalog,
  installments,
};
