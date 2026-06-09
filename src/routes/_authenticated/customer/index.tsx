import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/customer/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/customer/"!</div>;
}
