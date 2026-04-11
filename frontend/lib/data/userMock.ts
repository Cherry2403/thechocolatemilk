import type { UserProfile } from "@/lib/types/user";

/** Mock current user for development. Liked/disliked lists are managed by TasteContext at runtime. */
export const CURRENT_USER: UserProfile = {
  id: "user-01",
  email: "diep@thelotusunion.com",
  username: "diep",
  privateAssistantName: "Lotus",
  liked: [],
  disliked: [],
};
