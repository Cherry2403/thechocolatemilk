import type { FeedItem } from "@/lib/types/feed";
import { FEED_MOCK } from "./feedMock";

/* ══════════════════════════════════════════════════════════════════
   Mock Chat Response Engine
   Keyword-matching rules powering the AI assistant.
   Two modes: "shop" (includes product suggestions) and "advice" (text only).
   Friend-aware: responses differ based on who you're talking to.
   Swap for OpenAI API in Phase 9.
   ══════════════════════════════════════════════════════════════════ */

export type ChatMode = "shop" | "advice";

export interface MockResponse {
  content: string;
  gif?: string;
  suggestions?: FeedItem[];
}

type ResponseFactory = (mode: ChatMode) => MockResponse[];

interface MockRule {
  triggers: string[];
  responses: ResponseFactory;
}

/* ── Helpers ── */

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(count: number): FeedItem[] {
  return [...FEED_MOCK].sort(() => Math.random() - 0.5).slice(0, count);
}

function itemsByTag(tags: string[], count: number): FeedItem[] {
  const matching = FEED_MOCK.filter((i) => i.tags.some((t) => tags.includes(t)));
  return matching.sort(() => Math.random() - 0.5).slice(0, count);
}

/* ── GIFs ── */

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

/* ══════════════════════════════════════════════════════════════════
   Friend taste profiles (mock, will come from real taste API later)
   ══════════════════════════════════════════════════════════════════ */

interface FriendProfile {
  displayName: string;
  username: string;
  likes: string;
  dislikes: string;
  style: string;
  tags: string[];
}

const FRIEND_PROFILES: Record<string, FriendProfile> = {
  "user-02": {
    displayName: "Sarah",
    username: "sarah.bloom",
    likes: "peonies, soft pastels, cottagecore vibes, anything that looks like a film still",
    dislikes: "roses (too basic for her), anything too tropical or loud",
    style: "romantic cottagecore",
    tags: ["romantic", "soft", "pastel", "elegant"],
  },
  "user-03": {
    displayName: "Alex",
    username: "alex.k",
    likes: "sculptural arrangements, dried flowers, earthy tones, statement pieces",
    dislikes: "anything too sweet or girly, baby pink, glitter",
    style: "modern minimalist",
    tags: ["minimal", "modern", "sculptural", "earthy"],
  },
  "user-04": {
    displayName: "Maya",
    username: "maya.rose",
    likes: "bold colors, tropical flowers, maximalist styling, bright yellows and oranges",
    dislikes: "white flowers (finds them boring), minimalism",
    style: "maximalist tropical",
    tags: ["bold", "exotic", "tropical", "vibrant"],
  },
  "user-05": {
    displayName: "Jordan",
    username: "j.winter",
    likes: "clean lines, neutral tones, architectural arrangements, eucalyptus",
    dislikes: "fussy arrangements, too many colors mixed together",
    style: "clean architectural",
    tags: ["minimal", "modern", "elegant", "classic"],
  },
};

function getFriendProfile(contactId: string): FriendProfile | null {
  return FRIEND_PROFILES[contactId] ?? null;
}

/* ══════════════════════════════════════════════════════════════════
   Self rules (talking to your own assistant)
   ══════════════════════════════════════════════════════════════════ */

const SELF_RULES: MockRule[] = [
  {
    triggers: ["hi", "hello", "hey", "sup", "yo", "heyy", "good morning", "good evening"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "hey!! ok i'm ready to find you something cute, what are we looking for today?"
          : "heyyy what's on your mind? flowers, fashion, gift ideas, i got you",
        gif: GIFS.wave,
      },
      { content: "omg hi!! tell me what you need and i'll figure it out" },
      {
        content: mode === "shop"
          ? "hey! based on your taste i already have some ideas... want me to just show you?"
          : "hey! i've been paying attention to your likes btw. ask me anything",
        gif: GIFS.sparkle,
      },
    ],
  },

  {
    triggers: ["flower", "bouquet", "arrangement", "peony", "peonies", "tulip", "lily", "orchid", "rose"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "ok so based on your likes you're giving romantic but make it elegant. here's what i think you'd love:"
          : "ok so your flower vibe is definitely soft and romantic. think peonies, ranunculus, garden roses. you tend to heart the pastel-heavy arrangements and skip anything too structured or tropical. basically you want it to look like it was just picked from a cottage garden",
        suggestions: mode === "shop" ? randomItems(3) : undefined,
        gif: GIFS.flowers,
      },
      {
        content: mode === "shop"
          ? "you've been hearting a lot of soft pastel stuff so i pulled these for you:"
          : "ngl your taste in flowers is really consistent. you always go for the dreamy, soft arrangements. roses are a yes but only the garden variety not the stiff supermarket ones. you'd probably hate anything too tropical or architectural",
        suggestions: mode === "shop" ? randomItems(4) : undefined,
      },
    ],
  },

  {
    triggers: ["fashion", "outfit", "clothes", "dress", "style", "wear"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "your fashion taste is giving quiet luxury, clean lines, muted tones, nothing too loud. here:"
          : "ok so your fashion taste is very 'i woke up like this but make it expensive' energy. you lean toward minimal, neutral stuff with good fabric. you don't really heart anything with big logos or loud prints",
        suggestions: mode === "shop" ? randomItems(3) : undefined,
        gif: GIFS.sparkle,
      },
      {
        content: mode === "shop"
          ? "based on what you've hearted, here are some pieces that feel very you:"
          : "honestly your style is super cohesive, soft neutrals, elevated basics, nothing too trendy. you'd probably love something that looks expensive but isn't trying too hard",
        suggestions: mode === "shop" ? randomItems(3) : undefined,
      },
    ],
  },

  {
    triggers: ["my style", "my taste", "what do i like", "profile", "preference", "what am i into"],
    responses: () => [
      {
        content: "ok so here's your vibe based on everything you've hearted: romantic but not over the top, soft color palettes (pinks, whites, sage greens), minimal styling, and anything that feels like a slow sunday morning. you skip bold/tropical stuff almost every time",
      },
      {
        content: "your taste is honestly really clear. you love elegant and romantic, soft textures, spring colors. you're not into maximalism or anything too loud. basically you want everything to feel like a french countryside aesthetic",
        gif: GIFS.wink,
      },
    ],
  },

  {
    triggers: ["rate", "think", "opinion", "good", "worth", "what do you think"],
    responses: () => [
      {
        content: "ok honestly? that's very you. it hits your usual style marks, the soft tones, the elegant vibe. i'd say go for it",
        gif: GIFS.thumbsUp,
      },
      {
        content: "yeah that's a solid pick for your taste. it's giving exactly the energy you tend to heart. i'd rate it like a 9/10 for you specifically",
      },
      {
        content: "not gonna lie it aligns really well with your profile. you tend to love stuff like this so i think you'd be happy with it",
        gif: GIFS.chef,
      },
    ],
  },

  {
    triggers: ["price", "budget", "cheap", "expensive", "affordable", "under", "cost"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "ok let me pull some options at different price points for you:"
          : "so based on your history your sweet spot is usually $40-75. you tend to skip the super cheap stuff (it shows) but you're not going all out either. want me to find something in that range?",
        suggestions: mode === "shop"
          ? [...FEED_MOCK].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)).slice(0, 4)
          : undefined,
      },
    ],
  },

  {
    triggers: ["dinner", "party", "event", "wedding", "date", "occasion"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "for an event you want something elegant but not overwhelming, here are my picks:"
          : "ok for a dinner party i'd say go elegant but restrained, you don't want the flowers competing with the conversation. something soft and low-profile. single flower type arrangements are usually the move",
        suggestions: mode === "shop" ? itemsByTag(["elegant", "classic", "minimal"], 3) : undefined,
      },
      {
        content: mode === "shop"
          ? "what's the vibe? romantic, modern, rustic? here are some starter options:"
          : "depends on the vibe honestly. romantic dinner: garden roses or ranunculus. more modern event: something sculptural and minimal. tell me more and i can get specific",
        gif: GIFS.thinking,
      },
    ],
  },

  {
    triggers: ["how many", "quantity", "one", "several", "multiple", "just one"],
    responses: () => [
      {
        content: "for a dinner table i'd say 2-3 smaller arrangements spread out > one giant centerpiece. unless you're going for drama, in which case one huge thing can actually be really cool",
      },
      {
        content: "for a gift one beautiful piece is always the move. for your home, a few scattered around different rooms makes everything feel intentional",
        gif: GIFS.sparkle,
      },
    ],
  },

  {
    triggers: ["thank", "thanks", "appreciate", "helpful", "perfect", "love it", "that's great"],
    responses: () => [
      { content: "omg of course!! come back anytime, this is literally what i'm here for", gif: GIFS.heart },
      { content: "yay!! glad that helped. your taste is really good btw, makes my job easy lol", gif: GIFS.clap },
    ],
  },

  {
    triggers: ["help", "what can you", "how does", "explain", "what do you do"],
    responses: () => [
      {
        content: "ok so here's what i can do:\n- find flowers or fashion that match your vibe\n- give you gift ideas for your friends based on their taste\n- tell you if something is a yes or no for your style\n- break down your taste profile\n\njust ask naturally, i'll figure out what you mean",
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   Friend rules (talking to a friend's assistant)
   ══════════════════════════════════════════════════════════════════ */

const FRIEND_RULES: MockRule[] = [
  {
    triggers: ["hi", "hello", "hey", "sup", "yo", "heyy"],
    responses: (mode) => [
      {
        content: mode === "shop"
          ? "hey! i know their taste pretty well at this point, tell me what you're shopping for and i'll point you in the right direction"
          : "hey! i can tell you a lot about what they like and don't like, just ask",
        gif: GIFS.wave,
      },
    ],
  },

  {
    triggers: ["flower", "bouquet", "arrangement", "peony", "peonies", "tulip", "lily", "orchid", "rose", "what do they like", "what flowers"],
    responses: () => [{ content: "FRIEND_FLOWER_ADVICE" }],
  },

  {
    triggers: ["gift", "birthday", "present", "what to get", "idea", "surprise"],
    responses: () => [{ content: "FRIEND_GIFT_ADVICE" }],
  },

  {
    triggers: ["style", "fashion", "taste", "vibe", "aesthetic", "what do they wear"],
    responses: () => [{ content: "FRIEND_STYLE_ADVICE" }],
  },

  {
    triggers: ["don't like", "hate", "avoid", "not into", "dislike"],
    responses: () => [{ content: "FRIEND_DISLIKES" }],
  },
];

/* ── Resolve friend placeholder responses ── */

function resolveFriendResponse(
  raw: MockResponse,
  friend: FriendProfile,
  mode: ChatMode
): MockResponse {
  if (raw.content === "FRIEND_FLOWER_ADVICE") {
    return {
      content: mode === "shop"
        ? `ok so ${friend.displayName} is really into ${friend.likes.split(",")[0]} and that whole ${friend.style} aesthetic. here are some things i think they'd actually love:`
        : `ok so for flowers: ${friend.displayName} is really into ${friend.likes}. their whole thing is ${friend.style}. i'd avoid ${friend.dislikes.split(",")[0].trim()} if i were you, that's not really their vibe`,
      suggestions: mode === "shop" ? itemsByTag(friend.tags, 3) : undefined,
    };
  }

  if (raw.content === "FRIEND_GIFT_ADVICE") {
    return {
      content: mode === "shop"
        ? `for ${friend.displayName} you want to lean into that ${friend.style} aesthetic they love. they're really into ${friend.likes.split(",")[0]} and ${friend.likes.split(",")[1]?.trim() ?? "clean simple things"}. here are some solid picks:`
        : `ok gift advice for ${friend.displayName}: they're super into ${friend.likes}. their whole vibe is ${friend.style} so anything in that direction is a safe bet. i'd stay away from ${friend.dislikes} though, that would probably miss for them`,
      suggestions: mode === "shop" ? itemsByTag(friend.tags, 4) : undefined,
      gif: GIFS.heart,
    };
  }

  if (raw.content === "FRIEND_STYLE_ADVICE") {
    return {
      content: mode === "shop"
        ? `${friend.displayName}'s taste is very ${friend.style}. they love ${friend.likes}. here are pieces that match their aesthetic:`
        : `${friend.displayName}'s whole thing is ${friend.style}. they love ${friend.likes}. honestly their taste is really consistent so once you get the vibe it's easy to shop for them`,
      suggestions: mode === "shop" ? itemsByTag(friend.tags, 3) : undefined,
    };
  }

  if (raw.content === "FRIEND_DISLIKES") {
    return {
      content: `yeah ${friend.displayName} is pretty clear about what they don't like: ${friend.dislikes}. so i'd just avoid those and you're good`,
    };
  }

  return raw;
}

/* ── Fallbacks ── */

const SELF_FALLBACK: MockResponse[] = [
  { content: "hmm tell me more, are you looking for something for yourself or a gift?", gif: GIFS.thinking },
  { content: "i'd love to help but can you give me a bit more context? occasion, budget, or style would help" },
  { content: "not sure i follow lol, try asking something like 'what flowers for a dinner party' or 'is this my style'" },
];

function FRIEND_FALLBACK(friend: FriendProfile): MockResponse[] {
  return [
    { content: `not totally sure what you mean but i can tell you a lot about ${friend.displayName}'s taste if you just ask!` },
    { content: `hmm, could you be more specific? like are you trying to find a gift for ${friend.displayName} or just want to know their vibe?`, gif: GIFS.thinking },
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Main export
   ══════════════════════════════════════════════════════════════════ */

export function getMockResponse(
  userMessage: string,
  contactId: string,
  mode: ChatMode = "shop"
): MockResponse {
  const lower = userMessage.toLowerCase();
  const isSelf = contactId === "self";
  const friend = isSelf ? null : getFriendProfile(contactId);

  if (isSelf) {
    for (const rule of SELF_RULES) {
      if (rule.triggers.some((t) => lower.includes(t))) {
        return pickRandom(rule.responses(mode));
      }
    }
    return pickRandom(SELF_FALLBACK);
  }

  if (friend) {
    for (const rule of FRIEND_RULES) {
      if (rule.triggers.some((t) => lower.includes(t))) {
        const raw = pickRandom(rule.responses(mode));
        return resolveFriendResponse(raw, friend, mode);
      }
    }
    return pickRandom(FRIEND_FALLBACK(friend));
  }

  // Unknown friend (no profile yet)
  return {
    content: mode === "shop"
      ? "i don't have much data on their taste yet but here are some universally loved picks:"
      : "i don't have enough data on their taste yet. once they've used the app more i'll be able to tell you a lot more about what they like",
    suggestions: mode === "shop" ? randomItems(3) : undefined,
  };
}
