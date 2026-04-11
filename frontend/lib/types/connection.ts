export type ConnectionStatus = "pending" | "accepted";

export interface Connection {
  id: string;
  userId: string;
  friendId?: string;
  friendUsername: string;
  friendAssistantName?: string;       // their AI assistant's name
  status: ConnectionStatus;           // both sides must confirm
  /** Who sent the request: the userId or the friendId */
  initiatedBy: string;
  createdAt: string;
}
