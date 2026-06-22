import { createFileRoute, redirect } from "@tanstack/react-router";

const ROLE_ROUTES = {
  COMPANY: [
    "/company/overview",
    "/company/products",
    "/company/applications",
    "/company/marketers",
    "/company/admins",
    "/company/commissions",
    "/company/analytics",
  ],

  ADMIN: [
    "/company/overview",
    "/company/applications",
    "/company/marketers",
    "/company/products",
    "/company/commissions",
  ],
} as const;

export const Route = createFileRoute("/_authenticated/_layout/company/_layout")(
  {
    beforeLoad: ({ context: { auth }, location }) => {
      const user = auth?.user;

      if (!user) {
        throw redirect({
          to: "/login",
        });
      }

      const allowedRoutes =
        ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES] ?? [];

      const hasAccess = allowedRoutes.some((route) =>
        location.pathname.startsWith(route)
      );

      if (!hasAccess) {
        throw redirect({
          to: "/company/overview",
        });
      }
    },
  }
);
