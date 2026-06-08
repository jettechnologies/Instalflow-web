import { apiService } from "@services/api-service";
import type { SubscriptionPlan } from "@utils/types";

export const getAllPlans = async () => {
  const res = await apiService.get<SubscriptionPlan[]>("/subscriptions/plans");
  return res.data;
};
