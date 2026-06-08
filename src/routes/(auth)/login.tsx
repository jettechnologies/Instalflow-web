import { Box } from "@chakra-ui/react";
import { RightPanel } from "@components/auth/company-onboarding";
import { LoginForm } from "@components/auth/login-form";
import { LeftPanel } from "@components/shared/left-panel";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      bg="var(--bg-layer-1)"
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
      <Box
        bg="var(--bg-layer-1)"
        borderRight={{ base: "none", md: "1px solid var(--border-structural)" }}
        order={{ base: 2, md: 1 }}>
        <LeftPanel
          step={0}
          title="Sign in"
          subtitle="Access your InstalFlow workspace."
          showSteps={false}>
          <LoginForm
            onRegisterClick={() =>
              navigate({
                to: "/company-onboarding",
                search: { view: "onboarding-step1" },
              })
            }
            onLoginSuccess={() => navigate({ to: "/dashboard" })}
          />
        </LeftPanel>
      </Box>

      <Box
        display={{ base: "none", md: "block" }}
        order={{ base: 1, md: 2 }}
        position="sticky"
        top={0}
        h="100vh">
        <RightPanel view="login" />
      </Box>
    </Box>
  );
}
