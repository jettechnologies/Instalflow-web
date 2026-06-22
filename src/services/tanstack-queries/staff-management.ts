import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import type { UrlParams } from "@services/api-service";
import {
  getAdminDetails,
  getAllAdmins,
  getAllMarketers,
  getMarketerDetails,
  getMarketersCreatedByAdmin,
} from "@services/queries/staff-management";

export const getAllAdminsQueryOptions = (params: Partial<UrlParams>) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin_management.all(params),
    queryFn: () => getAllAdmins(params),
  });

export const getAllMarketersQueryOptions = (params: Partial<UrlParams>) =>
  queryOptions({
    queryKey: QUERY_KEYS.marketer_management.all(params),
    queryFn: () => getAllMarketers(params),
  });

export const getAdminDetailQueryOptions = (adminId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin_management.details(adminId),
    queryFn: () => getAdminDetails(adminId),
  });

export const getMarketerDetailQueryOptions = (marketerId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin_management.details(marketerId),
    queryFn: () => getMarketerDetails(marketerId),
  });

interface getMarketersCreatedByAdmin {
  adminId: string;
  params: Partial<UrlParams>;
}

export const getMarketersCreatedByAdminQueryOptions = ({
  adminId,
  params,
}: getMarketersCreatedByAdmin) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin_management.marketerCreatedByAdmins(
      adminId,
      params
    ),
    queryFn: () => getMarketersCreatedByAdmin(adminId, params),
  });
