import { apiService } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type {
  CreateAdminResponse,
  InviteMarketerResponse,
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
