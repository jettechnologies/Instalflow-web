import { apiService, type UrlParams } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type {
  KycApplication,
  KycStatus,
  PaginatedKycApplications,
} from "@utils/types/response-type";

export interface KycApplicationFilters extends Partial<UrlParams> {
  status?: KycStatus;
  search?: string;
  marketerId?: string;
  marketerName?: string;
}

export const getAllKycApplications = async (
  params: KycApplicationFilters = {}
): Promise<PaginatedKycApplications> => {
  const response = await apiService.get<PaginatedKycApplications>(
    ENDPOINTS.kyc.base,
    params
  );

  console.log(response, "response");

  return response.data;
};

export const getKycApplicationById = async (
  applicationId: string
): Promise<KycApplication> => {
  const response = await apiService.get<KycApplication>(
    ENDPOINTS.kyc.detail(applicationId)
  );

  return response.data;
};

export const getSignedDocumentUrl = async (
  applicationId: string
): Promise<{ signedUrl: string; expiresIn: string }> => {
  const response = await apiService.get<{
    signedUrl: string;
    expiresIn: string;
  }>(ENDPOINTS.kyc.document(applicationId));

  return response.data;
};
