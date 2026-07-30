import { createFileRoute } from "@tanstack/react-router";
import { createRoleGuard } from "@utils/requireRole";
import type { UserRole } from "@utils/types";

const roleGuard = createRoleGuard({
  allowedRoutes: {
    COMPANY: [
      "/company/overview",
      "/company/products",
      "/company/approvals",
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
  },
  defaultRedirects: {
    COMPANY: "/company/overview",
    ADMIN: "/company/overview",
  },
});

export const Route = createFileRoute("/_authenticated/_layout/company/_layout")(
  {
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
  }
);
