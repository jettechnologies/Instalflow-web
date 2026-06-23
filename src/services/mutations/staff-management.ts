import { apiService } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type {
  AdminStatusResponse,
  ApprovalStatus,
  CreateAdminResponse,
  InviteMarketerResponse,
  MarketerStatusResponse,
} from "@utils/types/response-type";

export const inviteMarketer = (data: { name: string; email: string }) => {
  return apiService.post<InviteMarketerResponse>(
    ENDPOINTS.staffManagement.marketer.inviteMarketer,
    data
  );
};

export const createAdmin = (data: { name: string; email: string }) => {
  return apiService.post<CreateAdminResponse>(
    ENDPOINTS.staffManagement.admin.createAdmin,
    data
  );
};

export const requestToggleMarketerStatus = (marketerId: string) => {
  return apiService.post<MarketerStatusResponse>(
    ENDPOINTS.staffManagement.marketer.requestMarketerStatusToggle(marketerId)
  );
};

export const requestDeleteMarketerAccount = (marketerId: string) => {
  return apiService.post<MarketerStatusResponse>(
    ENDPOINTS.staffManagement.marketer.requestMarketerDelete(marketerId)
  );
};

interface HandleApprovalRequestParams {
  requestId: string;
  data: {
    action: Omit<ApprovalStatus, "PENDING">;
  };
}

export const handleApprovalRequest = (params: HandleApprovalRequestParams) => {
  return apiService.post<MarketerStatusResponse>(
    ENDPOINTS.staffManagement.marketer.handleApprovalRequest(params.requestId),
    params.data
  );
};

export const toggleMarketerStatus = (marketerId: string) => {
  return apiService.patch<any>(
    ENDPOINTS.staffManagement.marketer.toggleMarketerStatus(marketerId)
  );
};

export const deleteMarketerAccount = (marketerId: string) => {
  return apiService.delete<any>(
    ENDPOINTS.staffManagement.marketer.softDeleteMarketer(marketerId)
  );
};

export const toggleAdminStatus = (adminId: string) => {
  return apiService.patch<AdminStatusResponse>(
    ENDPOINTS.staffManagement.admin.toggleAdminStatus(adminId)
  );
};

export const deleteAdminAccount = (adminId: string) => {
  return apiService.delete<AdminStatusResponse>(
    ENDPOINTS.staffManagement.admin.softDeleteAdmin(adminId)
  );
};
