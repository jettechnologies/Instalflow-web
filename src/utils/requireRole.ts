import { redirect } from "@tanstack/react-router";
import type { UserRole } from "@utils/types/auth";

interface RoleGuardConfig {
  allowedRoutes: Partial<Record<UserRole, string[]>>;
  defaultRedirects: Partial<Record<UserRole, string>>;
}

export function createRoleGuard({
  allowedRoutes,
  defaultRedirects,
}: RoleGuardConfig) {
  return ({
    context: { auth },
    location,
  }: {
    context: {
      auth: {
        user?: { role: UserRole; name: string };
        isLoading: boolean;
      } | null;
    };
    location: { pathname: string };
  }) => {
    const user = auth?.user;
    const isLoading = auth?.isLoading;

    if (!user && !isLoading) {
      throw redirect({ to: "/login" });
    }

    if (user) {
      const userRole = user.role;
      const allowed = allowedRoutes[userRole];

      if (!allowed) {
        const redirectTo = defaultRedirects[userRole] ?? "/login";
        throw redirect({ to: redirectTo });
      }

      const hasAccess = allowed.some((route) =>
        location.pathname.startsWith(route)
      );

      if (!hasAccess) {
        const redirectTo = defaultRedirects[userRole] ?? "/login";
        throw redirect({ to: redirectTo });
      }
    }
  };
}
