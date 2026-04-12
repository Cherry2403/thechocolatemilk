# THE LOTUS UNION

A style and gift curation platform that learns your taste — and your friends' — so you never have to guess what to give.

---

## What It Does

**Browse.** A Pinterest-style feed of flowers, fashion, and gifts. Heart what you love, dismiss what you don't. Your taste profile builds itself.

**Connect.** Add friends by username. Accept or decline pending requests. Build a shared taste network of people you care about.

**Ask.** An AI chat assistant that knows you and your friends' styles. Say *"What would Alex like for her birthday?"* and get personalized suggestions based on what Alex actually liked — powered by their taste profile, not generic picks.

---

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Feed** | `/feed` | Pinterest masonry grid. Heart/X items. They disappear with a satisfying animation. |
| **Chat** | `/chat` | Two-panel messenger (contacts + conversation). Ask for yourself or a friend. |
| **Connections** | `/connections` | Friends list, pending requests (incoming/outgoing), search by username. |
| **Profile** | `/profile` | Your taste timeline — liked and dismissed items in 2 tabs. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16+ · TypeScript · React 19 · Tailwind CSS v4 |
| **Backend** | NestJS · TypeScript · TypeORM (TODO) |
| **Database** | PostgreSQL (TODO) |
| **AI** | OpenAI — text + image chat (TODO) |

Frontend and backend are fully separated. Next.js will call NestJS REST API endpoints. All persistent data will live in PostgreSQL — no localStorage for persistent storage.

**Current status:** Frontend-only with mock data. Backend integration in Phase 7.

---

## Getting Started

```bash
cd frontend
npm install
npm run dev                    # → http://localhost:3000

# Backend (separate terminal)
npx @nestjs/cli new backend
cd backend
npm install @nestjs/typeorm typeorm pg @nestjs/config class-validator class-transformer

# Database
docker-compose up -d           # Mysql on :5432
npm run start:dev              # → http://localhost:3001
```

---

## Project Structure

```
frontend/                        Next.js App Router
├── app/
│   ├── layout.tsx               Root layout + BottomNav + font loading
│   ├── page.tsx                 Redirect to /feed
│   ├── globals.css              Tailwind directives + theme tokens
│   ├── loading.tsx              Root loading spinner (all routes)
│   ├── error.tsx                Root error boundary (all routes)
│   │
│   ├── feed/
│   │   ├── page.tsx             Feed page
│   │   └── components/
│   │       └── FeedCard.tsx     Image + heart/X overlay, disappear animation
│   │
│   ├── chat/
│   │   ├── page.tsx             Two-panel chat (contacts + conversation)
│   │   └── components/
│   │       ├── ChatContactList.tsx  Sidebar contacts, sorted by latest message
│   │       ├── ChatBubble.tsx       Message bubble + GIF + suggestions
│   │       ├── ChatTimeSeparator.tsx Messenger-style time label between groups
│   │       └── ChatInput.tsx        Text input + send
│   │
│   ├── connections/
│   │   ├── page.tsx             Connections page
│   │   └── components/
│   │       ├── PendingRequests.tsx  Incoming/outgoing request management
│   │       ├── FriendList.tsx       Accepted friends + remove with confirmation
│   │       └── UsernameSearch.tsx   Search + add friend (debounced 300ms)
│   │
│   └── profile/
│       ├── page.tsx             Profile page
│       └── components/
│           ├── ProfileHeader.tsx    Username, assistant name, stats
│           └── TasteTimeline.tsx    Liked/Dismissed tab switcher + masonry grid
│
├── lib/
│   ├── data/                    Mock data (frontend-only phase)
│   │   ├── feedMock.ts          24 FeedItem objects with images
│   │   ├── chatMock.ts          Keyword-matching AI response engine (12 rules)
│   │   ├── connectionsMock.ts   Mock connections + search results
│   │   └── userMock.ts          Current user mock profile
│   ├── types/                   Shared TypeScript interfaces
│   │   ├── feed.ts              FeedItem
│   │   ├── user.ts              UserProfile, TasteProfile
│   │   ├── chat.ts              ChatMessage, ChatContact
│   │   ├── connection.ts        Connection, ConnectionStatus, SearchResult
│   │   └── index.ts             Re-exports
│   └── utils/
│       └── time-ago.ts          Time formatting (timeAgo, formatChatTime, shouldShowTimeSeparator)
│
├── contexts/
│   └── TasteContext.tsx         Global state: liked/disliked FeedItem arrays
│
├── hooks/
│   ├── useFeed.ts               Feed pagination, like/dislike actions
│   ├── useChat.ts               Chat messages, typing indicator, mock responses
│   └── useColumnCount.ts        Responsive column count for masonry
│
├── components/                  Shared components
│   ├── BottomNav.tsx            Fixed bottom nav (active indicator + dot)
│   ├── MasonryGrid.tsx          Responsive masonry layout (2→5 cols, shared)
│   ├── Providers.tsx            Client boundary for context providers
│   ├── ConfirmDialog.tsx        Accessible confirm modal (focus trap, Escape, ARIA)
│   └── Loading.tsx              Loading spinner (used by route segments)
│
├── public/images/               Dev images (feed items, backgrounds)
├── next.config.ts
├── tsconfig.json
├── .env.local                   NEXT_PUBLIC_API_URL
└── package.json
```

---

## API (planned — NestJS backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/feed?page=1&limit=20` | Paginated feed items |
| `POST` | `/api/profile/like/:itemId` | Like an item |
| `POST` | `/api/profile/dislike/:itemId` | Dislike an item |
| `DELETE` | `/api/profile/like/:itemId` | Undo like |
| `DELETE` | `/api/profile/dislike/:itemId` | Undo dislike |
| `GET` | `/api/profile` | Current user profile + likes/dislikes |
| `GET` | `/api/profile/:userId/taste` | Computed taste profile |
| `POST` | `/api/chat` | Send message, get AI response |
| `GET` | `/api/chat/history?limit=50` | Chat history |
| `GET` | `/api/connections` | Friend list |
| `POST` | `/api/connections` | Send connection request |
| `DELETE` | `/api/connections/:id` | Remove connection |
| `GET` | `/api/connections/search?username=<query>` | Search users by username |

---

## Key Features

### Feed
- Pinterest-style masonry grid (2 cols mobile → 4–5 cols desktop)
- Image-only cards with heart/X overlay buttons
- Two-phase disappear animation (fade + scale, then height collapse)
- Race condition guard prevents rapid double-click from firing two actions
- Infinite scroll with `IntersectionObserver`

### Chat
- Two-panel layout: contact sidebar + conversation area
- Desktop: sidebar always visible alongside chat
- Mobile: contact list → tap → full-screen conversation with back button
- Messenger-style time separators between message groups (5min gap, not per-bubble)
- Contact list sorted by most recent message (latest on top)
- Each contact row shows: assistant name, last message preview, formatted time
- Mock AI with 12 keyword-matching rule categories + fallback
- Inline GIF support, product suggestion thumbnails

### Connections
- Pending requests section (incoming: Accept/Decline, outgoing: "Requested" label)
- Preview: 3 latest incoming, expand to show all
- Accepted friends list with username (primary) + assistant name (secondary)
- Remove friend with accessible confirmation dialog (focus trap, Escape, ARIA)
- Debounced search (300ms) by username to send connection request
- Connection states: `pending` → `accepted` with `initiatedBy` tracking

### Navigation
- Fixed bottom nav (Instagram-style) with 4 route icons
- Active route: green icon fill + dot indicator; inactive: reduced opacity
- Route-level `loading.tsx` and `error.tsx` segments for all pages

### Profile
- Header: username (primary), AI assistant name (secondary), like/dismiss stats
- Taste Timeline: two-tab switcher (liked / dismissed)
- Masonry grid of items in each tab (reverse-chronological)
- Tap item to undo action (un-like or un-dismiss)

### Typography
- Cormorant Garamond (serif) for headings — loaded via `next/font/google`
- Inter (sans-serif) for body text — loaded via `next/font/google`
- CSS variables registered in Tailwind v4 `@theme` for `font-sans` / `font-serif`

---

## Data Models

```typescript
interface FeedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'flower' | 'fashion';
  brand: string;
  productLink: string;
  tags: string[];
  colors: string[];
  price?: number;
  currency?: string;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  privateAssistantName: string;    // user-chosen name for their AI assistant
  liked: { itemId: string; likedAt: string }[];
  disliked: { itemId: string; dislikedAt: string }[];
}

interface TasteProfile {             // computed at runtime, not stored
  userId: string;
  topColors: string[];
  topStyles: string[];
  topBrands: string[];
  topCategories: string[];
  likedCount: number;
  dislikedCount: number;
}

interface Connection {
  id: string;
  userId: string;
  friendId?: string;
  friendUsername: string;
  friendAssistantName?: string;
  status: 'pending' | 'accepted';
  initiatedBy: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  gif?: string;
  suggestions?: FeedItem[];
  timestamp: string;                 // ISO 8601 — displayed as Messenger-style separators
}
```

---

## Design

Simple, elegant, clean.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FDFBD4` | Butter cream — warm, soft |
| Surface | `#FFFFFF` | Cards, elevated surfaces |
| Text primary | `#1B1B1B` | Deep brown — warm near-black |
| Text secondary | `#454545` | Mid-brown gray |
| Accent green | `#004225` | Deep lotus green — nav bar |
| Warm accent | `#C4A484` | Light brown — secondary accent |
| Dark accent | `#5C4033` | Dark brown — headings |
| Butter yellow | `#D4A843` | Active nav, highlights |
| Heart active | `#C96B7A` | Dusty rose — like button |
| Dismiss active | `#8A8A7A` | Soft taupe — dismiss button |

**Typography:** Cormorant Garamond (headings) · Inter (body)

**Tailwind CSS v4 only** — no raw CSS unless Tailwind cannot solve it. No emoji in UI. No clutter.

---

## Implementation Phases

> Full detailed spec with sub-tasks and checkboxes lives in [AGENTS.md](AGENTS.md).

### Phase 1: Frontend Scaffold + Foundation ✅
- Next.js 16+ with TypeScript + Tailwind v4
- Directory structure, global styles, design tokens
- Routes: `/feed`, `/chat`, `/connections`, `/profile`
- BottomNav, layout wrapper, active route highlighting

### Phase 2: Frontend — Feed Page ✅
- MasonryGrid (responsive: 2 col mobile → 4–5 col desktop)
- FeedCard: image-only with heart/X overlay
- Two-phase disappear animation (fade + scale → height collapse)
- Infinite scroll with IntersectionObserver
- Mock feed data (24 items)

### Phase 3: Frontend — Profile Page ✅
- ProfileHeader: username, assistant name, stats
- TasteTimeline: liked/dismissed tabs with masonry grid
- Tap to undo (un-like / un-dismiss)

### Phase 3b: Frontend — Connections Page ✅
- PendingRequests: incoming (Accept/Decline) + outgoing ("Requested")
- FriendList: accepted friends with remove confirmation dialog
- UsernameSearch: search + connect by username

### Phase 4: Frontend — Chat Page ✅
- Two-panel layout (contacts sidebar + conversation)
- ChatContactList: sorted by latest message, time display
- ChatBubble: timestamps, GIFs, product suggestions
- Mock AI engine: 12 keyword-matching rules + fallback
- Per-contact message persistence

### Phase 5: Backend Scaffold + Database
- NestJS project setup with TypeORM + PostgreSQL
- Docker Compose for local database
- Entities, migrations, seed data

### Phase 6: Backend — Core Endpoints
- Feed, Profile, Taste, Connection, Chat services + controllers

### Phase 7: Integration — Frontend ↔ Backend
- Replace mock data with real API calls
- State management refinement

### Phase 8: Auth (TODO)
### Phase 9: AI Integration (TODO)
### Phase 10: Production (TODO)

---

**Version:** 2.0.0 — Next.js + NestJS + PostgreSQL
**Status:** Frontend complete (Phases 1–4). Backend integration next.
**Code Standard:** Sustainable, production-level code. Tailwind CSS v4 only. Clean architecture, proper TypeScript typing, reusable components.
