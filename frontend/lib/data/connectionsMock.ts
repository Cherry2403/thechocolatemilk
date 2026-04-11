import type { Connection } from "@/lib/types/connection";

/* ── Connected friends (mock) ── */

export const CONNECTIONS_MOCK: Connection[] = [
  /* ── Accepted connections ── */
  {
    id: "conn-01",
    userId: "user-01",
    friendId: "user-02",
    friendUsername: "sarah.bloom",
    friendAssistantName: "Petal",
    status: "accepted",
    initiatedBy: "user-01",
    createdAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "conn-02",
    userId: "user-01",
    friendId: "user-03",
    friendUsername: "alex.k",
    friendAssistantName: "Sage",
    status: "accepted",
    initiatedBy: "user-03",
    createdAt: "2025-01-02T14:20:00Z",
  },
  {
    id: "conn-03",
    userId: "user-01",
    friendId: "user-04",
    friendUsername: "maya.rose",
    friendAssistantName: "Ivy",
    status: "accepted",
    initiatedBy: "user-01",
    createdAt: "2025-02-10T09:15:00Z",
  },
  {
    id: "conn-04",
    userId: "user-01",
    friendId: "user-05",
    friendUsername: "j.winter",
    friendAssistantName: "Fern",
    status: "accepted",
    initiatedBy: "user-05",
    createdAt: "2025-03-22T16:45:00Z",
  },

  /* ── Pending incoming requests (others sent to user-01) ── */
  {
    id: "conn-05",
    userId: "user-01",
    friendId: "user-06",
    friendUsername: "lily.chen",
    friendAssistantName: "Dahlia",
    status: "pending",
    initiatedBy: "user-06",
    createdAt: "2025-04-08T11:00:00Z",
  },
  {
    id: "conn-06",
    userId: "user-01",
    friendId: "user-07",
    friendUsername: "emma.wood",
    friendAssistantName: "Clover",
    status: "pending",
    initiatedBy: "user-07",
    createdAt: "2025-04-09T14:30:00Z",
  },
  {
    id: "conn-07",
    userId: "user-01",
    friendId: "user-08",
    friendUsername: "noah.park",
    friendAssistantName: "Birch",
    status: "pending",
    initiatedBy: "user-08",
    createdAt: "2025-04-10T09:00:00Z",
  },
  {
    id: "conn-08",
    userId: "user-01",
    friendId: "user-09",
    friendUsername: "chloe.tan",
    friendAssistantName: "Willow",
    status: "pending",
    initiatedBy: "user-09",
    createdAt: "2025-04-11T18:20:00Z",
  },

  /* ── Pending outgoing request (user-01 sent to another) ── */
  {
    id: "conn-09",
    userId: "user-01",
    friendId: "user-10",
    friendUsername: "lucas.rei",
    friendAssistantName: "Cedar",
    status: "pending",
    initiatedBy: "user-01",
    createdAt: "2025-04-07T10:00:00Z",
  },
];

/* ── Search results (mock) — for the "add friend" flow ── */

export interface SearchResult {
  id: string;
  username: string;
  privateAssistantName: string;
}

export const SEARCH_RESULTS_MOCK: SearchResult[] = [
  { id: "user-11", username: "rosa.lin", privateAssistantName: "Peony" },
  { id: "user-12", username: "kai.morgan", privateAssistantName: "Moss" },
  { id: "user-13", username: "ava.stone", privateAssistantName: "Flora" },
  // Existing friends/pending — search should filter these out
  { id: "user-02", username: "sarah.bloom", privateAssistantName: "Petal" },
  { id: "user-03", username: "alex.k", privateAssistantName: "Sage" },
  { id: "user-06", username: "lily.chen", privateAssistantName: "Dahlia" },
];
