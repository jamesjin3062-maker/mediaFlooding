"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";

// Routes that only exist inside the signed-in app. They use the saved theme
// from the first paint, and dark when nothing is saved. Everything else
// (landing, marketing, auth, share pages) has no dark design and stays light.
const APP_ROUTE = /^\/(list|tasks|settings|analytics|admin|create|dashboard|wallet|campaigns|accounts|bounties|social-pr|submissions|announcements|messages|refer)(\/|$)/;

const AppThemeScope = createContext<(active: boolean) => void>(() => {});

/** Dark by default inside the app. A saved light choice still wins. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [shellActive, setShellActive] = useState(false);
  const themed = shellActive || APP_ROUTE.test(pathname);

  return (
    <AppThemeScope.Provider value={setShellActive}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme={themed ? undefined : "light"}
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </AppThemeScope.Provider>
  );
}

/**
 * Applies the saved theme while the signed-in app shell is mounted. "/" is
 * both the landing page and the signed-in Create page, so the route alone
 * cannot tell them apart.
 */
export function useAppTheme(active: boolean) {
  const setShellActive = useContext(AppThemeScope);
  useEffect(() => {
    if (!active) return;
    setShellActive(true);
    return () => setShellActive(false);
  }, [active, setShellActive]);
}
