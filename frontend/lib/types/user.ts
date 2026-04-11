export interface UserProfile {
  id: string;
  email: string;
  username: string;
  privateAssistantName: string;   // user-chosen name for their AI assistant
  liked: string[];                // item IDs
  disliked: string[];             // item IDs
  taste?: TasteProfile;           // computed from likes — populated on demand
}

/** Computed at runtime from a user's liked items. Not stored directly. */
export interface TasteProfile {
  topColors: string[];
  topStyles: string[];
  topBrands: string[];
  topCategories: string[];
  likedCount: number;
  dislikedCount: number;
}
