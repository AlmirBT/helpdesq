"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { Toaster } from "sonner";

let queryClient: QueryClient | null = null;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 30_000,
        },
      },
    });
  }
  return queryClient;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "rounded-2xl bg-card/95 text-card-foreground shadow-soft border border-border/40",
            description: "text-muted-foreground",
            actionButton:
              "rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium",
          },
        }}
      />
    </QueryClientProvider>
  );
}

