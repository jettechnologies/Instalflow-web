import { Center } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_layout/marketer/overview"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center width="full" minHeight="100vh">
      Marketer Overview
    </Center>
  );
}
