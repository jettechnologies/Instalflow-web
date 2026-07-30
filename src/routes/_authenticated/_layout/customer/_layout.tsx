import { createFileRoute } from "@tanstack/react-router";
import { createRoleGuard } from "@utils/requireRole";
import type { UserRole } from "@utils/types";

const roleGuard = createRoleGuard({
  allowedRoutes: {
    CUSTOMER: ["/customer/dashboard", "/customer/installments"],
  },
  defaultRedirects: {
    CUSTOMER: "/customer/dashboard",
  },
});

export const Route = createFileRoute(
  "/_authenticated/_layout/customer/_layout"
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
