import { useQuery } from "@tanstack/react-query";
import { mockDialogs } from "@/data/mock/dialogs";
import type { DialogSummary } from "@/types/dialog";

async function fetchDialogs(): Promise<DialogSummary[]> {
  // Имитация лёгкой сетевой задержки для более реалистичного UX
  await new Promise((resolve) => setTimeout(resolve, 160));
  return mockDialogs;
}

export function useDialogs() {
  return useQuery({
    queryKey: ["dialogs"],
    queryFn: fetchDialogs,
  });
}

