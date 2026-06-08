import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { useAuth, type AuthContextType } from "@context/auth-provider";
import type { QueryClient } from "@tanstack/react-query";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";

type AuthenticationContext = {
  auth?: AuthContextType;
  queryClient?: QueryClient;
};

export const Route = createRootRouteWithContext<AuthenticationContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { accessToken, refreshToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const REFRESH_INTERVAL = 23 * 60 * 60 * 1000;

    const timer = setInterval(async () => {
      await refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, [accessToken]);

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
