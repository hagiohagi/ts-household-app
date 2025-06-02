import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from '@/theme/theme';
import { AppContextProvider } from '@/context/AppContext';
import '@/styles/index.css';
import '@/styles/calendar.css';
import TransactionProvider from '@/components/layout/TransactionProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <TransactionProvider>
          <Component {...pageProps} />
        </TransactionProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
} 