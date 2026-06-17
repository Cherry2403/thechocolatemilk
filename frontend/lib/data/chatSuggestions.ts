import type { ChatMode } from "./chatMock";

/* ══════════════════════════════════════════════════════════════════
   Suggested questions shown above the chat input.
   Pool is randomized so users see different prompts each time.
   Split by: self vs friend contact, shop vs advice mode.
   ══════════════════════════════════════════════════════════════════ */

const SELF_SHOP = [
  "what flowers match my vibe?",
  "find me something for a dinner party",
  "show me something under $60",
  "what would you pick for me today?",
  "find me a statement piece",
  "something romantic but not too much",
  "what's trending that fits my taste?",
  "show me your top 3 picks for me",
];

const SELF_ADVICE = [
  "what's my overall taste like?",
  "do i lean more romantic or minimal?",
  "what flowers should i never buy?",
  "what colors dominate my likes?",
  "how would you describe my vibe to someone?",
  "am i more maximalist or minimalist?",
  "what occasions suit my taste best?",
  "what's the one thing i always heart?",
];

const FRIEND_SHOP = [
  "what flowers would they love?",
  "find a birthday gift for them",
  "show me something in their style",
  "what's a safe pick for their taste?",
  "find something under $80 for them",
  "what would make them obsessed?",
  "what's a statement piece for them?",
  "surprise me with something for them",
];

const FRIEND_ADVICE = [
  "what's their aesthetic in one word?",
  "what flowers do they actually like?",
  "what should i absolutely avoid getting them?",
  "how would you describe their taste?",
  "what colors are they into?",
  "are they more bold or understated?",
  "what do they hate?",
  "what's the safest gift direction for them?",
];

export function getSuggestions(mode: ChatMode, isFriend: boolean): string[] {
  let pool: string[];
  if (isFriend) {
    pool = mode === "shop" ? FRIEND_SHOP : FRIEND_ADVICE;
  } else {
    pool = mode === "shop" ? SELF_SHOP : SELF_ADVICE;
  }
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}
