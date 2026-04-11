export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  suggestions?: import("./feed").FeedItem[];
  timestamp: string;
}
