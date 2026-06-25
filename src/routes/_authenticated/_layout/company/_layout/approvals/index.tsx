import { ApprovalsTable } from "@components/tables/company/approvals-table";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { usePrefetchQueryData } from "@hooks/prefetch-query-data";
import { LIMIT } from "@services/api-service";
import { getAllApprovalsQueryOptions } from "@services/tanstack-queries/staff-management";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { APPROVAL_STATUS } from "@utils/misc";
import { OverviewSearch } from "@utils/schema";
import type { ApprovalStatus } from "@utils/types/response-type";
import * as Yup from "yup";

export const ApprovalSearchSchema = OverviewSearch.shape({
  status: Yup.string().oneOf(APPROVAL_STATUS).default("PENDING").optional(),
});

type ApprovalSearchSchema = Yup.InferType<typeof ApprovalSearchSchema>;

export const Route = createFileRoute(
  "/_authenticated/_layout/company/_layout/approvals/"
)({
  validateSearch: (search) =>
    ApprovalSearchSchema.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  staticData: {
    searchSchema: ApprovalSearchSchema,
  },
  loaderDeps: ({ search }) => {
    const { forceChangePassword, ...params } = search;

    return { params };
  },
  loader: async ({ context: { queryClient }, deps: { params } }) => {
    await queryClient?.ensureQueryData({
      ...getAllApprovalsQueryOptions(params),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { params } = Route.useLoaderDeps();
  const updateSearchParam = useUpdateSearchParam<ApprovalSearchSchema>();
  const { prefetch } = usePrefetchQueryData(getAllApprovalsQueryOptions);

  const { data, isLoading } = useQuery({
    ...getAllApprovalsQueryOptions(params),
    select: (data) => data.data,
  });

  const approvalRequests = data?.requests || [];
  const pagination = data?.pagination;

  const onPageChange = (page: number) =>
    updateSearchParam("page", page.toString());

  const onItemsPerPageChange = (size: number) =>
    updateSearchParam("limit", size.toString());

  const onStatusChange = (status: ApprovalStatus) =>
    updateSearchParam("status", status);

  const onPrefetch = () =>
    prefetch({ ...params, page: String((pagination?.currentPage || 1) + 1) });

  return (
    <ApprovalsTable
      requests={approvalRequests}
      pagination={
        pagination ?? {
          total: 0,
          totalPages: 1,
          currentPage: 1,
          limit: Number(LIMIT),
        }
      }
      isLoading={isLoading}
      status={params.status}
      onStatusChange={onStatusChange}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
      onMouseEnter={onPrefetch}
    />
  );
}
