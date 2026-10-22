"use client";

import type { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
import { AppContextProvider } from "@/context/AppContext";
import TransactionProvider from "@/components/layout/TransactionProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <TransactionProvider>{children}</TransactionProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}
