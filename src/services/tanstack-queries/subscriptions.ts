import { getAllPlans } from "@services/queries/subscription";
import { QUERY_KEYS } from "@services/query-keys";
import { queryOptions } from "@tanstack/react-query";

export const getSubscriptionPlansOptions = () => {
  return queryOptions({
    queryKey: QUERY_KEYS.plans.all(),
    queryFn: () => getAllPlans(),
  });
};
