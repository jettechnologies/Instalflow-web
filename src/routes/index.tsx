import { Button } from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() =>
          navigate({
            to: "/company-onboarding",
            search: { view: "onboarding-step1" },
          })
        }>
        Onboarding
      </Button>
      {/* <Button
        onClick={() =>
          navigate({
            to: "/login",
          })
        }>
        Login
      </Button> */}
    </div>
  );
}
