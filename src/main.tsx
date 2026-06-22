import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ChakraProvider } from "@chakra-ui/react";
import "../style/globals.scss";
import { routeTree } from "./routeTree.gen";
import { ToastProvider, AuthProvider, useAuth } from "./context";
import TanstackQueryProvider from "./providers/tanstack-provider";
import { useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import theme from "@theme";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined,
    queryClient: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp({ queryClient }: { queryClient: QueryClient }) {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

function App() {
  const [queryClient, setQueryClient] = useState<QueryClient | undefined>(
    undefined
  );

  return (
    <ChakraProvider theme={theme} resetCSS>
      <ToastProvider>
        <AuthProvider>
          <TanstackQueryProvider onClientReady={setQueryClient}>
            {queryClient && <InnerApp queryClient={queryClient} />}
          </TanstackQueryProvider>
        </AuthProvider>
      </ToastProvider>
    </ChakraProvider>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
