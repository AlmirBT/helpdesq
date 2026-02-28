import type { ReactNode } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen flex-col bg-background text-foreground pb-[72px] md:pb-0">
        <TopBar />
        <DashboardShell>{children}</DashboardShell>
        <OnboardingOverlay />
        <BottomNav />
      </div>
    </DashboardGuard>
  );
}

