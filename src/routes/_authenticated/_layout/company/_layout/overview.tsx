import { Center } from "@chakra-ui/react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_layout/company/_layout/overview")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center border="2px solid white" width="full" minHeight="100vh"></Center>
  );
}
