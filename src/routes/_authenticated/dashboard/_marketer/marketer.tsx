import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_marketer/marketer"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/_user-dashboard/marketers/dashboard"!</div>
  );
}
