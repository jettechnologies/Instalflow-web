import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useToastContext } from "@hooks/context";
import type { ToastStatus } from "@context/toast-provider";
import { useState, useEffect } from "react";
// import { toast } from "sonner";

// Extend MutationMeta to allow our custom keys
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

export const createQueryClient = ({
  openToast,
}: {
  openToast: (message: string, status: ToastStatus) => void;
}) => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (
          mutation.meta?.successMessage !== null &&
          mutation.meta?.successMessage !== undefined
        ) {
          // toast.success(mutation.meta?.successMessage as string);
          openToast(mutation.meta?.successMessage as string, "success");
        }
      },
      onError: (_error, _variables, _context, mutation) => {
        // if (mutation.meta?.errorMessage) {
        // 	toast.error(mutation.meta?.successMessage)
        // }
        let message: string | undefined;

        if (_error instanceof Error && _error.message) {
          message = _error.message;
        }
        if (!message && mutation.meta?.errorMessage) {
          message = mutation.meta.errorMessage as string;
        }
        if (!message) {
          message = "An unexpected error occurred.";
        }

        openToast(message, "error");
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        {
          if (mutation.meta?.invalidatesQuery) {
            queryClient.invalidateQueries({
              queryKey: mutation.meta?.invalidatesQuery,
            });
          }
        }
      },
    }),
  });

  return queryClient;
};

function TanstackQueryProvider({
  children,
  onClientReady,
}: {
  children: React.ReactNode;
  onClientReady?: (client: QueryClient) => void;
}) {
  const { openToast } = useToastContext();
  // create the QueryClient once
  const [queryClient] = useState(() => createQueryClient({ openToast }));

  useEffect(() => {
    if (onClientReady) {
      onClientReady(queryClient);
    }
  }, [onClientReady, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default TanstackQueryProvider;
