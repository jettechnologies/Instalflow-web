import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth?.isLoading) {
      return;
    }

    if (!auth?.isAuthenticated && !auth?.accessToken) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
