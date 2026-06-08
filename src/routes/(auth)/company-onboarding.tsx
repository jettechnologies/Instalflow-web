import { CompanyOnboardingFlow } from "@containers/onboarding-flow";
import { createFileRoute } from "@tanstack/react-router";
import { OnboardingSearchSchema } from "@utils/schema";

export const Route = createFileRoute("/(auth)/company-onboarding")({
  validateSearch: (search) =>
    OnboardingSearchSchema.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { view } = Route.useSearch();

  return <CompanyOnboardingFlow view={view} />;
}
