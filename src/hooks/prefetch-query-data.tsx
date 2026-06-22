import {
  useQueryClient,
  type EnsureQueryDataOptions,
} from "@tanstack/react-query";

/**
 * Generic hook to prefetch query data with type inference.
 *
 * @param getOptions - a function that takes any argument(s) and returns EnsureQueryDataOptions
 */
export function usePrefetchQueryData<
  TArgs extends unknown[],
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends readonly unknown[],
>(
  getOptions: (
    ...args: TArgs
  ) => EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  const queryClient = useQueryClient();

  const prefetch = (...args: TArgs) => {
    return queryClient.ensureQueryData<TQueryFnData, TError, TData, TQueryKey>(
      getOptions(...args)
    );
  };

  return { prefetch };
}
