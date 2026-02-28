export type MessageRole = "user" | "agent" | "system";

export interface MessageAttachment {
  id: string;
  type: "image" | "file" | "link";
  name: string;
  sizeLabel?: string;
  previewUrl?: string;
}

export interface Message {
  id: string;
  dialogId: string;
  role: MessageRole;
  author: string;
  avatarColor?: string;
  content: string;
  createdAt: string;
  attachments?: MessageAttachment[];
  reactions?: string[];
  isInternalNote?: boolean;
}

