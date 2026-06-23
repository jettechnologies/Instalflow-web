const staffManagement = {
  marketer: {
    inviteMarketer: "/auth/marketers",
    getAllMarketers: "/admin/marketers",
    getPendingApprovals: "/company/approvals",
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

export const ENDPOINTS = {
  staffManagement,
};
