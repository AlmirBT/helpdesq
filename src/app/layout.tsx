import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { CommandPalette } from "@/components/command-palette";
import { ScrollbarVisibility } from "@/components/layout/scrollbar-visibility";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FunTime HelpDesk",
  description: "Рабочее место поддержки — обращения, задачи, смены",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppProviders>
            {children}
            <CommandPalette />
            <ScrollbarVisibility />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}

