import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import { getAllKycApplications, getKycApplicationById } from "../queries/kyc";
import type { KycApplicationFilters } from "../queries/kyc";

export const getAllKycApplicationsQueryOptions = (
  params: KycApplicationFilters = {}
) =>
  queryOptions({
    queryKey: QUERY_KEYS.kyc.all(params),
    queryFn: async () => {
      const response = await getAllKycApplications(params);
      return response;
    },
  });

export const getKycApplicationByIdQueryOptions = (applicationId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.kyc.detail(applicationId),
    queryFn: async () => {
      const response = await getKycApplicationById(applicationId);
      return response;
    },
    enabled: Boolean(applicationId),
  });

// export const getMarketerApplicationsQueryOptions = (
//   marketerId: string,
//   params: Partial<KycApplicationFilters> = {}
// ) =>
//   queryOptions({
//     queryKey: QUERY_KEYS.kyc.mine({ marketerId, ...params }),
//     queryFn: async () => {
//       const response = await getAllKycApplications({
//         ...params,
//         marketerId,
//       });
//       return response;
//     },
//   });
