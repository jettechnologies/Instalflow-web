import { apiService } from "@services/api-service";
import type {
  RegisterPayload,
  KycSubmitPayload,
  KycSubmitResponse,
  RegisterResponse,
} from "@utils/types/invite";
import type { Product } from "@utils/types/response-type";

export const registerReferral = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await apiService.post<RegisterResponse>(
    "/kyc/register",
    payload
  );
  return response.data;
};

export const submitApplication = async (
  onboardingToken: string,
  payload: KycSubmitPayload
): Promise<KycSubmitResponse> => {
  const form = new FormData();
  form.append("productId", payload.productId);
  form.append("variantId", payload.variantId);
  form.append("installmentPlanId", payload.installmentPlanId);
  form.append("idType", payload.idType);
  form.append("idNumber", payload.idNumber);
  form.append("bankStatement", payload.bankStatement);

  const response = await apiService.post<KycSubmitResponse>(
    "/kyc/submit",
    form,
    { headers: { Authorization: `Bearer ${onboardingToken}` } }
  );
  return response.data;
};

export const getInviteProduct = async (slug: string): Promise<Product> => {
  const response = await apiService.get<Product>(`/products/slug/${slug}`);
  return response.data;
};
