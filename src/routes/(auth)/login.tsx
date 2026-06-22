import { Box } from "@chakra-ui/react";
import { RightPanel } from "@components/auth/company-onboarding";
import { LoginForm } from "@components/auth/login-form";
import { LeftPanel } from "@components/shared/left-panel";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import * as Yup from "yup";

export const LoginSearch = Yup.object({
  redirect: Yup.string().optional(),
});

export type LoginSearchType = Yup.InferType<typeof LoginSearch>;

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: (search) =>
    LoginSearch.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

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
            redirect={redirect}
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
