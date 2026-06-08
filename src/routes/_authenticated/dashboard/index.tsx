import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  beforeLoad: ({ context: { auth } }) => {
    const userRoles = auth?.user?.role;

    console.log(userRoles, "user roles");

    switch (userRoles) {
      case "COMPANY":
        throw redirect({
          to: "/dashboard/company",
        });
      case "ADMIN":
        throw redirect({
          to: "/dashboard/company",
        });
      case "MARKETER":
        throw redirect({
          to: "/dashboard/marketer",
        });
      case "CUSTOMER":
        throw redirect({
          to: "/dashboard/customer",
        });

      default:
        throw redirect({
          to: "/login",
        });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return undefined;
}
