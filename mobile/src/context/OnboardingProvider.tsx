import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { acceptGuestBrowsing, hasAcceptedGuestBrowsing } from "../lib/preferences";

interface OnboardingContextValue {
  /** False until the stored flag has been read — hold routing on this. */
  ready: boolean;
  /** True once the customer has chosen to browse without an account. */
  guestAccepted: boolean;
  continueAsGuest: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ ready: false, guestAccepted: false });

  useEffect(() => {
    let active = true;
    hasAcceptedGuestBrowsing().then((accepted) => {
      if (active) setState({ ready: true, guestAccepted: accepted });
    });
    return () => {
      active = false;
    };
  }, []);

  const continueAsGuest = useCallback(async () => {
    // Flip locally first so the gate opens on this frame; persistence is a
    // convenience for next launch, not a precondition.
    setState({ ready: true, guestAccepted: true });
    await acceptGuestBrowsing();
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({ ...state, continueAsGuest }),
    [state, continueAsGuest]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}
