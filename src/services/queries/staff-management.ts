import {
  apiService,
  LIMIT,
  type PaginatedData,
  type UrlParams,
} from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type {
  AdminUserResponse,
  DetailedAdminResponse,
  DetailedMarketerResponse,
  MarketerUserResponse,
} from "@utils/types/response-type";

export const getAllMarketers = (
  params: Partial<UrlParams> = { limit: LIMIT, sortOrder: "desc" }
) => {
  return apiService.get<PaginatedData<"marketers", MarketerUserResponse>>(
    ENDPOINTS.staffManagement.marketer.getAllMarketers,
    params
  );
};

export const getMarketerDetails = (marketerId: string) => {
  return apiService.get<DetailedMarketerResponse>(
    ENDPOINTS.staffManagement.marketer.getSingleMarketer(marketerId)
  );
};

export const getAllAdmins = (
  params: Partial<UrlParams> = { limit: LIMIT, sortOrder: "desc" }
) => {
  return apiService.get<PaginatedData<"admins", AdminUserResponse>>(
    ENDPOINTS.staffManagement.admin.getAllAdmin,
    params
  );
};

export const getAdminDetails = (adminId: string) => {
  return apiService.get<DetailedAdminResponse>(
    ENDPOINTS.staffManagement.admin.getSingleAdmin(adminId)
  );
};

export const getMarketersCreatedByAdmin = (
  adminId: string,
  params: Partial<UrlParams> = { limit: LIMIT, sortOrder: "desc" }
) => {
  return apiService.get<PaginatedData<"marketers", MarketerUserResponse>>(
    ENDPOINTS.staffManagement.admin.getAdminsMarketers(adminId),
    params
  );
};
