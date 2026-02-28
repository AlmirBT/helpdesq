export type DialogPlatform = "telegram" | "vk" | "email" | "web" | "mobile";

export type DialogPriority = "low" | "normal" | "high" | "urgent";

export type DialogStatus = "open" | "pending" | "snoozed" | "resolved";

export interface DialogSummary {
  id: string;
  customer: string;
  subject: string;
  platform: DialogPlatform;
  priority: DialogPriority;
  status: DialogStatus;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageAt: string;
  tags: string[];
  hasIncidentTag?: boolean;
  slaBreached?: boolean;
  score?: number;
}

