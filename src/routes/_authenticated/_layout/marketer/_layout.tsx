import { createFileRoute } from "@tanstack/react-router";
import { createRoleGuard } from "@utils/requireRole";
import type { UserRole } from "@utils/types";

const roleGuard = createRoleGuard({
  allowedRoutes: {
    MARKETER: [
      "/marketer/overview",
      "/marketer/products",
      "/marketer/applications",
      "/marketer/referrals",
      "/marketer/links",
      "/marketer/payouts",
    ],
  },
  defaultRedirects: {
    MARKETER: "/marketer/overview",
  },
});

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/_layout"
)({
  beforeLoad: ({ context, location }) => {
    const auth = context.auth;

    if (auth) {
      const { user: authUser, isLoading } = auth;
      const userRole = authUser?.role as UserRole;
      const name = authUser?.name || "";
      roleGuard({
        context: {
          auth: { user: { role: userRole, name }, isLoading },
        },
        location,
      });
    }
  },
});
