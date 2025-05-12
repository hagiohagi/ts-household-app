import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from '../src/theme/theme';
import { AppContextProvider } from '../src/context/AppContext';
import '../src/index.css';
import '../src/calendar.css';

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