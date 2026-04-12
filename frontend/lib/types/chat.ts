export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  gif?: string;                                    // GIF URL for AI personality
  suggestions?: import("./feed").FeedItem[];
  timestamp: string;                               // ISO 8601 — displayed as Messenger-style time separators
}

/** A chat contact: an accepted connection's assistant or the user's own. */
export interface ChatContact {
  id: string;
  username: string;
  assistantName: string;
  isOwnAssistant?: boolean;
  /** Preview of the most recent message in this conversation. */
  lastMessage?: string;
  /** ISO timestamp of the most recent message (used for sorting). */
  lastMessageTime?: string;
}
