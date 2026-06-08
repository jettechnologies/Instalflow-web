import type { OnboardingIntentData } from "@utils/types";

const SESSION_KEY = "ifl_onboarding_intent";

interface OnboardingSession {
  intentId: string;
  companyName?: string;
  email?: string;
}

const readSession = (): OnboardingSession | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as OnboardingSession) : null;
  } catch {
    return null;
  }
};

const writeSession = (
  data: Pick<OnboardingIntentData, "intentId" | "companyName" | "email">
) => {
  const session: OnboardingSession = {
    intentId: data.intentId,
    companyName: data.companyName,
    email: data.email,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

export { readSession, writeSession, clearSession };
