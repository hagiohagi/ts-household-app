import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from '@/theme/theme';
import { AppContextProvider } from '@/context/AppContext';
import '@/styles/index.css';
import '@/styles/calendar.css';
import TransactionProvider from '@/components/layout/TransactionProvider';
import { Transaction } from '@/types';

interface CustomAppProps extends AppProps {
  pageProps: {
    initialTransactions: Transaction[];
  };
}

export default function App({ Component, pageProps }: CustomAppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <TransactionProvider initialTransactions={pageProps.initialTransactions}>
          <Component {...pageProps} />
        </TransactionProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
} 