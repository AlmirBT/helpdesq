import { useQuery } from "@tanstack/react-query";
import { mockMessages } from "@/data/mock/messages";
import type { Message } from "@/types/message";

async function fetchMessages(dialogId: string | null): Promise<Message[]> {
  if (!dialogId) return [];
  await new Promise((resolve) => setTimeout(resolve, 140));
  return mockMessages
    .filter((m) => m.dialogId === dialogId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function useMessages(dialogId: string | null) {
  return useQuery({
    queryKey: ["messages", dialogId],
    queryFn: () => fetchMessages(dialogId),
    enabled: !!dialogId,
  });
}

