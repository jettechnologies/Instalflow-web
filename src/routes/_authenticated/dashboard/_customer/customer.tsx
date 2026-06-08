import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_customer/customer"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/_user-dashboard/customers/dashboard"!</div>
  );
}
