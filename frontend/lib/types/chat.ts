export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  gif?: string;                                    // GIF URL for AI personality
  suggestions?: import("./feed").FeedItem[];
  timestamp: string;                               // stored internally, NOT displayed in UI
}
