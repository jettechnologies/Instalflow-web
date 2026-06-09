import type { OnboardingView } from "@utils/types";
import { readSession } from "@store/session-store/onboarding-session";
import { useUpdateSearchParam } from "@hooks/context/useSearchParams";
import { useCallback, useState } from "react";
import { Box, Link, Text } from "@chakra-ui/react";
import { LeftPanel } from "@components/shared/left-panel";
import {
  RightPanel,
  Step1Identity,
  Step2Plans,
} from "@components/auth/company-onboarding";
import { LoginForm } from "@components/auth/login-form";
import type { OnboardingSearchType } from "@utils/schema";
import { SessionStorageHelper } from "@utils/helpers";

interface OnboardingFlowProps {
  view: OnboardingView;
}

export interface UserData {
  companyName: string;
  adminName: string;
  email: string;
  password: string;
}

export function CompanyOnboardingFlow({ view: rawView }: OnboardingFlowProps) {
  const updateSearchParam = useUpdateSearchParam<OnboardingSearchType>();

  const [userData, setUserData] = useState<UserData | null>(null);

  const view: OnboardingView =
    (rawView as OnboardingView) ?? "onboarding-step1";

  const setView = useCallback(
    (next: OnboardingView) => updateSearchParam("view", next),
    [updateSearchParam]
  );

  const session = readSession();

  const setUserDataSession = (data: UserData) =>
    SessionStorageHelper.set<UserData>("IFL_USER_DATA", data);

  const screenMeta: Record<
    OnboardingView,
    { title: string; subtitle: string; step: 0 | 1 }
  > = {
    "onboarding-step1": {
      title: "Create your workspace",
      subtitle: "Register your company to get started with InstalFlow.",
      step: 0,
    },
    "onboarding-step2": {
      title: "Choose a subscription",
      subtitle: `Select the plan that fits ${session?.companyName || "your company"}.`,
      step: 1,
    },
    login: {
      title: "Sign in",
      subtitle: "Access your InstalFlow workspace.",
      step: 0,
    },
  };

  const meta = screenMeta[view];

  const sessionUserData = SessionStorageHelper.get<UserData>("IFL_USER_DATA");

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
          step={meta.step}
          title={meta.title}
          subtitle={meta.subtitle}
          showSteps={view !== "login"}>
          {view === "onboarding-step1" && (
            <>
              <Step1Identity
                onSuccess={(data) => {
                  setUserData(data);
                  setUserDataSession(data);
                  setView("onboarding-step2");
                }}
              />
              <Text
                fontSize="xs"
                color="var(--text-muted)"
                mt={5}
                textAlign="center">
                Already have an account?{" "}
                <Link
                  color="var(--brand-primary)"
                  ml="2px"
                  fontWeight="600"
                  onClick={() => setView("login")}
                  cursor="pointer">
                  Sign in
                </Link>
              </Text>
            </>
          )}

          {view === "onboarding-step2" && (
            <Step2Plans
              userData={sessionUserData ?? userData}
              onSuccess={() => setView("login")}
              onBack={() => setView("onboarding-step1")}
            />
          )}

          {view === "login" && (
            <LoginForm onRegisterClick={() => setView("onboarding-step1")} />
          )}
        </LeftPanel>
      </Box>

      <Box
        display={{ base: "none", md: "block" }}
        order={{ base: 1, md: 2 }}
        position="sticky"
        top={0}
        h="100vh">
        <RightPanel view={view} />
      </Box>
    </Box>
  );
}
