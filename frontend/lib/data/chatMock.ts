import type { FeedItem } from "@/lib/types/feed";
import { FEED_MOCK } from "./feedMock";

/* ══════════════════════════════════════════════════════════════════
   Mock Chat Response Engine
   ──────────────────────────────────────────────────────────────────
   Keyword-matching rules that power the AI assistant during the
   frontend-only phase. Each rule has trigger words and an array of
   possible responses (picked randomly). Rules that need dynamic
   product suggestions use a factory function so items are shuffled
   fresh on every call.

   Swap this for the OpenAI API call via backend in Phase 9.
   ══════════════════════════════════════════════════════════════════ */

/* ── Types ── */

interface MockResponse {
  content: string;
  gif?: string;
  suggestions?: FeedItem[];
}

type ResponseSource = MockResponse[] | (() => MockResponse[]);

interface MockRule {
  /** Any trigger found in the lowercased user message fires this rule. */
  triggers: string[];
  /** Static array or factory function that returns fresh responses. */
  responses: ResponseSource;
}

/* ── Helpers ── */

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(count: number): FeedItem[] {
  const shuffled = [...FEED_MOCK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function itemsByTag(tags: string[], count: number): FeedItem[] {
  const matching = FEED_MOCK.filter((i) =>
    i.tags.some((t) => tags.includes(t)),
  );
  return matching.sort(() => Math.random() - 0.5).slice(0, count);
}

function resolveResponses(source: ResponseSource): MockResponse[] {
  return typeof source === "function" ? source() : source;
}

/* ── GIF URLs (GIPHY CDN — lightweight embed links) ── */

const GIFS = {
  wave: "https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif",
  thinking: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
  excited: "https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif",
  flowers: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
  thumbsUp: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
  sparkle: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
  heart: "https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif",
  clap: "https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif",
  chef: "https://media.giphy.com/media/3o85xHi4t2UsuIY9QA/giphy.gif",
  wink: "https://media.giphy.com/media/ui1hpJSyBDWlG/giphy.gif",
  love: "https://media.giphy.com/media/l0HlvtIPdijJCbotq/giphy.gif",
  dance: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
};

/* ── Rule definitions ── */

const RULES: MockRule[] = [
  /* ── Greetings ── */
  {
    triggers: ["hi", "hello", "hey", "sup", "yo", "good morning", "good evening"],
    responses: [
      {
        content:
          "Hey there! I\u2019m your personal style curator. What can I help you find today \u2014 flowers, fashion, or the perfect gift?",
        gif: GIFS.wave,
      },
      {
        content:
          "Welcome back! Ready to discover something beautiful? Tell me what you\u2019re looking for.",
      },
      {
        content:
          "Hi! I\u2019ve been learning your taste. Want me to suggest something, or do you have a specific occasion in mind?",
        gif: GIFS.sparkle,
      },
    ],
  },

  /* ── Flower / bouquet requests ── */
  {
    triggers: ["flower", "bouquet", "arrangement", "roses", "peony", "tulip", "lily", "orchid"],
    responses: () => [
      {
        content:
          "Based on your taste, you gravitate toward elegant and romantic arrangements. Here are a few I think you\u2019ll love \u2014 how many are you thinking of getting?",
        suggestions: randomItems(3),
      },
      {
        content:
          "Gorgeous choice! I pulled some options that match your style. Would you like a single statement piece or a few smaller arrangements?",
        suggestions: randomItems(4),
        gif: GIFS.flowers,
      },
      {
        content:
          "Flowers! My favorite topic. You seem to love soft pastels and natural textures. Here are my top picks for you:",
        suggestions: randomItems(3),
      },
    ],
  },

  /* ── Fashion requests ── */
  {
    triggers: ["fashion", "outfit", "clothes", "dress", "style", "wear"],
    responses: () => [
      {
        content:
          "Your fashion taste leans minimal and elegant \u2014 clean lines, muted tones. Let me pull some pieces you might like:",
        suggestions: randomItems(3),
      },
      {
        content:
          "I love your style sense! Based on what you\u2019ve hearted, here are some fashion finds that feel very you:",
        suggestions: randomItems(3),
        gif: GIFS.sparkle,
      },
    ],
  },

  /* ── Friend-based queries ── */
  {
    triggers: ["sarah", "alex", "maya", "jordan", "friend", "birthday", "gift for"],
    responses: () => [
      {
        content:
          "Let me check their taste profile\u2026 They love minimal, modern arrangements with lots of green and white tones. I\u2019d suggest an Orchid Elegance or a Eucalyptus Wreath \u2014 both very them.",
        suggestions: itemsByTag(["minimal", "modern", "elegant"], 3),
      },
      {
        content:
          "Great idea! Based on their likes, they lean toward bold and sculptural pieces. How about a Protea Statement or a Tropical Heliconia? Want me to narrow it down by budget?",
        suggestions: itemsByTag(["bold", "sculptural", "exotic"], 3),
      },
      {
        content:
          "Thinking of someone special? I love that. Based on what I know about their style, here are some picks that would make their day:",
        suggestions: randomItems(3),
        gif: GIFS.heart,
      },
    ],
  },

  /* ── Rating / opinion requests ── */
  {
    triggers: ["rate", "think", "opinion", "good", "worth", "recommend"],
    responses: [
      {
        content:
          "Honestly? That\u2019s a solid 9/10 for your style. It matches your love for elegant, romantic pieces. The color palette is right in your wheelhouse too.",
        gif: GIFS.thumbsUp,
      },
      {
        content:
          "I\u2019d give it a strong recommendation! It aligns with your top styles \u2014 elegant and minimal. Plus, the color tones you usually heart are all over this one.",
      },
      {
        content:
          "Based on your taste profile, this is very you. If you\u2019re on the fence, I\u2019d say go for it. You tend to love pieces like this.",
        gif: GIFS.chef,
      },
    ],
  },

  /* ── Price / budget ── */
  {
    triggers: ["price", "budget", "cheap", "expensive", "affordable", "under", "cost"],
    responses: () => [
      {
        content:
          "I can work with any budget! Here are some beautiful options at different price points. What range are you comfortable with?",
        suggestions: [...FEED_MOCK]
          .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
          .slice(0, 4),
      },
      {
        content:
          "Smart to think about budget. The sweet spot in your taste is usually $40\u2013$75. Here are some picks in that range:",
        suggestions: FEED_MOCK.filter(
          (i) => (i.price ?? 0) >= 40 && (i.price ?? 0) <= 75,
        ).slice(0, 3),
      },
    ],
  },

  /* ── Quantity / how many ── */
  {
    triggers: ["how many", "quantity", "one", "several", "multiple", "just one"],
    responses: [
      {
        content:
          "For a dinner party, I\u2019d say 2\u20133 smaller arrangements spread across the table create a lovely atmosphere. Or one statement centerpiece if you want dramatic impact!",
      },
      {
        content:
          "It depends on the occasion! For a gift, one beautiful piece is perfect. For your home, a few scattered arrangements make every room feel alive.",
        gif: GIFS.sparkle,
      },
    ],
  },

  /* ── Dinner party / occasion ── */
  {
    triggers: ["dinner", "party", "event", "wedding", "date", "occasion"],
    responses: () => [
      {
        content:
          "A dinner party! I\u2019d go with something elegant but not overpowering \u2014 you want your guests to see each other, not just the flowers. Here are my picks:",
        suggestions: itemsByTag(["elegant", "classic", "minimal"], 3),
      },
      {
        content:
          "For events, I always recommend arrangements that complement the setting. What\u2019s the vibe \u2014 romantic, modern, rustic?",
        gif: GIFS.thinking,
      },
    ],
  },

  /* ── Thank you / gratitude ── */
  {
    triggers: ["thank", "thanks", "appreciate", "helpful", "perfect", "love it"],
    responses: [
      {
        content:
          "You\u2019re welcome! Happy to help anytime. Let me know when you need more inspiration.",
        gif: GIFS.heart,
      },
      {
        content:
          "Glad I could help! Your taste is impeccable, by the way. Come back anytime.",
        gif: GIFS.clap,
      },
    ],
  },

  /* ── Style / taste self-inquiry ── */
  {
    triggers: ["my style", "my taste", "what do i like", "profile", "preference"],
    responses: [
      {
        content:
          "From what I\u2019ve seen, you love elegant, romantic pieces with soft color palettes \u2014 pinks, whites, and greens dominate your likes. You tend to favor spring-inspired, minimal designs over bold or tropical ones.",
      },
      {
        content:
          "Your taste profile is shaping up beautifully! You lean toward romantic and elegant styles with natural textures. Brands like Bloom & Wild and Terrain seem to resonate with you the most.",
        gif: GIFS.wink,
      },
    ],
  },

  /* ── Help / what can you do ── */
  {
    triggers: ["help", "what can you", "how does", "explain"],
    responses: [
      {
        content:
          "I can help you with:\n\u2022 Finding flowers or fashion that match your taste\n\u2022 Gift recommendations for your connected friends\n\u2022 Rating items you\u2019re considering\n\u2022 Summarizing your style profile\n\nJust ask naturally \u2014 I\u2019ll figure out the rest!",
      },
    ],
  },
];

/* ── Fallback responses ── */

const FALLBACK: MockResponse[] = [
  {
    content:
      "Hmm, tell me more! Are you looking for something for yourself or for someone else?",
    gif: GIFS.thinking,
  },
  {
    content:
      "I\u2019d love to help with that. Can you give me a bit more context \u2014 occasion, budget, or style?",
  },
  {
    content:
      "Interesting! I\u2019m not sure I follow \u2014 could you rephrase that? I\u2019m best with flowers, fashion recommendations.",
  },
  {
    content:
      "I\u2019m still learning! Try asking me things like \u201CWhat flowers for a dinner party?\u201D or \u201CWhat would Sarah like for her birthday?\u201D",
    gif: GIFS.sparkle,
  },
];

/* ── Main export ── */

export function getMockResponse(userMessage: string): MockResponse {
  const lower = userMessage.toLowerCase();

  for (const rule of RULES) {
    if (rule.triggers.some((t) => lower.includes(t))) {
      return pickRandom(resolveResponses(rule.responses));
    }
  }

  return pickRandom(FALLBACK);
}
