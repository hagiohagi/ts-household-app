import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import AppLayout from "@/components/layout/AppLayout";
import "@/styles/index.css";
import "@/styles/calendar.css";

export const metadata: Metadata = {
  title: "家計簿アプリ",
  description: "日ごとの収入・支出を記録し、月次レポートで分析できる家計簿アプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
