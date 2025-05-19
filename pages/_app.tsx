import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from '@/theme/theme';
import { AppContextProvider } from '@/context/AppContext';
import '@/styles/index.css';
import '@/styles/calendar.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContextProvider>
  );
} 