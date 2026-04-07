# THELOTUSUNION

A style and gift curation platform that learns your taste — and your friends' — so you never have to guess what to give.

---

## What It Does

**Browse.** A Pinterest-style feed of flowers, fashion, and gifts. Heart what you love, dismiss what you don't. Your taste profile builds itself.

**Ask.** An AI chat assistant that knows your friends' styles. Say *"What would Alex like for her birthday?"* and get suggestions based on what Alex actually liked — not generic picks.

**Share.** Invite friends to browse the feed on their own device. Their preferences become available to you when you're shopping for them.

---

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Feed** | `/feed` | Pinterest masonry grid. Heart/X items. They disappear satisfyingly. |
| **Chat** | `/chat` | Messenger-style AI assistant. Ask for yourself or a friend. |
| **Profile** | `/profile` | Your taste timeline, style summary, and friend connections. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16+ · TypeScript · Tailwind CSS v4 |
| **Backend** | NestJS · TypeScript · TypeORM |
| **Database** | PostgreSQL |
| **AI** | TODO — OpenAI (text chat, no voice) |

Frontend and backend are fully separated. Next.js calls NestJS REST API endpoints. All data lives in PostgreSQL — no localStorage for persistent storage.

---

## Getting Started

```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
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
frontend/            Next.js
├── src/app/
│   ├── feed/                  Feed page + MasonryGrid + FeedCard
│   ├── chat/                  Chat page + ChatBubble + ChatInput
│   └── profile/               Profile page + Timeline + Summary + Connections
├── src/lib/
│   ├── api/                   API client (feed, profile, chat, connections)
│   └── types/                 Shared TypeScript interfaces
├── src/components/            BottomNav, Loading
└── public/images/             Dev images (feed items, backgrounds)

backend/             NestJS
├── src/
│   ├── feed/                  Controller + Service + Entity
│   ├── profile/               Controller + Service + TasteService + Entities
│   ├── chat/                  Controller + Service + Entity
│   ├── connection/            Controller + Service + Entity
│   ├── auth/                  TODO — JWT auth
│   └── database/              TypeORM config + seeds
└── docker-compose.yml         PostgreSQL container
```

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/feed?page=1&limit=20` | Paginated feed items |
| `POST` | `/api/profile/like/:itemId` | Like an item |
| `POST` | `/api/profile/dislike/:itemId` | Dislike an item |
| `DELETE` | `/api/profile/like/:itemId` | Undo like |
| `GET` | `/api/profile` | Current user profile + likes/dislikes |
| `POST` | `/api/chat` | Send message, get AI response |
| `GET` | `/api/chat/history` | Chat history |
| `GET` | `/api/connections` | Friend list |
| `POST` | `/api/connections` | Add friend |
| `DELETE` | `/api/connections/:id` | Remove friend |

---

## Feed

Pinterest-style masonry grid. 2 columns on phone, 4–5 on desktop.

Each card has a small heart and X overlaid on the image. Tap either and the card fades out, scales down, and collapses — cards below slide up to fill the gap. Infinite scroll loads more items.

Items span categories: flowers, fashion, gifts, accessories. Each has style tags, colors, a brand, and a product link.

---

## Profile

**Taste Timeline** — Reverse-chronological feed of everything you liked. Filter by category. Swipe to unlike.

**Style Summary** — Auto-computed from your browsing: top colors (swatches), preferred styles (tag pills), favorite brands, category distribution.

**Connections** — Friends list inline on the profile page. Add friends, see their browse status, share an invite link. Tap a friend to view their taste summary.

---

## Chat

Messenger-style AI assistant. Text input, chat bubbles, optional image upload.

Ask for yourself (*"What flowers for a dinner party?"*) or a friend (*"What would Sarah like?"*). The AI uses the relevant taste profile to respond.

Currently mocked in the backend. OpenAI integration planned — text only, no voice.

---

## Data Models

```typescript
interface FeedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'flower' | 'fashion' | 'gift' | 'accessory';
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
  liked: { itemId: string; likedAt: string }[];
  disliked: { itemId: string; dislikedAt: string }[];
}

interface TasteProfile {           // computed, not stored
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
  friendName: string;
  friendId?: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  suggestions?: FeedItem[];
  timestamp: string;
}
```

---

## Design

Simple, elegant, clean — fits fashion and flower niche.

- Warm off-white background (`#FAFAF8`)
- Near-black text, warm gray secondary
- Muted gold or dusty rose accent — subtle, never loud
- Light-weight uppercase headings with wide letter-spacing
- Soft shadows, no borders, rounded corners
- 200–300ms transitions, glass-morphism on overlays

No emoji. No clutter. No bright primary colors.

---

## Implementation Phases

### Phase 1: Frontend Scaffold + Foundation
- [ ] **1.1 — Project Setup**
  - [ ] Next.js 16+ with TypeScript + Tailwind v4
  - [ ] Directory structure: `app/`, `lib/`, `components/`, `types/`
  - [ ] Global styles + design tokens (colors, spacing, typography)
  - [ ] `.env.local` with `NEXT_PUBLIC_API_URL` placeholder

- [ ] **1.2 — Routing + Navigation**
  - [ ] `/feed`, `/chat`, `/profile` routes
  - [ ] BottomNav component (4 icons: home, chat, profile, settings)
  - [ ] Layout wrapper with nav + padding
  - [ ] Active route highlighting

### Phase 2: Frontend — Feed Page
- [ ] **2.1 — Feed Layout + Masonry Grid**
  - [ ] MasonryGrid component (responsive: 2 col mobile → 4–5 col desktop)
  - [ ] CSS Grid with `auto-rows: min-content`
  - [ ] Mock feed data in `lib/data/feedMock.ts` (20+ items)

- [ ] **2.2 — Feed Card Component**
  - [ ] FeedCard: image, overlay (small heart + X buttons)
  - [ ] Hover states, button positioning (bottom-right)
  - [ ] Tap to trigger action (no backend yet)

- [ ] **2.3 — Like/Dislike + Disappear Animation**
  - [ ] Click heart/X → fade out + scale down
  - [ ] Remove card from DOM
  - [ ] Cards below slide up to fill gap (grid auto-layout handles this)
  - [ ] Store likes/dislikes in `useState` (local, persists in session)

- [ ] **2.4 — Infinite Scroll**
  - [ ] IntersectionObserver on sentinel div at bottom
  - [ ] Append next batch of mock items on trigger
  - [ ] Loading state + skeleton cards

### Phase 3: Frontend — Profile Page
- [ ] **3.1 — Profile Header**
  - [ ] User display: avatar placeholder, name, username
  - [ ] Stats: total likes, top categories
  - [ ] Edit button (placeholder for later)

- [ ] **3.2 — Taste Timeline Tab**
  - [ ] Reverse-chronological grid of liked items
  - [ ] Filter tabs: All / Flowers / Fashion / Gifts / Accessories
  - [ ] Swipe-to-remove (or tap X) to unlike
  - [ ] Read from local state

- [ ] **3.3 — Style Summary Tab**
  - [ ] Color swatches (computed from liked items)
  - [ ] Style tags (pills from item metadata)
  - [ ] Top brands (list)
  - [ ] Category distribution (small chart or percentages)
  - [ ] **Compute locally** from mock items + likes

- [ ] **3.4 — Connections Tab**
  - [ ] Friends list (mock data)
  - [ ] Each friend: avatar, name, "View Taste"
  - [ ] Add friend button (modal with invite link)
  - [ ] Remove friend (swipe or tap menu)
  - [ ] **Share invite link** (copy to clipboard)

### Phase 4: Frontend — Chat Page
- [ ] **4.1 — Chat Layout**
  - [ ] Messenger-style: chat bubbles, input bar at bottom
  - [ ] User bubbles (right, light background) vs assistant bubbles (left, muted background)
  - [ ] Timestamp on each message (optional)

- [ ] **4.2 — Chat Bubbles + Formatting**
  - [ ] Text wrapping, emoji support
  - [ ] Links in responses (product suggestions)
  - [ ] Image thumbnail previews (for future AI analysis)

- [ ] **4.3 — Chat Input + Send**
  - [ ] Text input field, send button
  - [ ] Image upload button (optional, no backend yet)
  - [ ] Placeholder: "Ask for yourself or a friend..."
  - [ ] Auto-focus after send

- [ ] **4.4 — Mock Chat Responses**
  - [ ] Hardcoded assistant responses based on keywords
  - [ ] Example: "What would Sarah like?" → returns Sarah's mock taste summary
  - [ ] Store conversation in `useState`
  - [ ] Persist in sessionStorage (reload-safe)

---

### Phase 5: Backend Scaffold + Database
- [ ] **5.1 — NestJS Project Setup**
  - [ ] `npx @nestjs/cli new backend`
  - [ ] Install: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`, `class-validator`, `class-transformer`
  - [ ] TypeORM config (PostgreSQL connection)
  - [ ] CORS enabled for frontend

- [ ] **5.2 — Database + Docker**
  - [ ] `docker-compose.yml` with PostgreSQL 15+
  - [ ] `docker-compose up -d` → Postgres on `:5432`
  - [ ] Database: `thelotusunion_dev`

- [ ] **5.3 — TypeORM Entities**
  - [ ] `User` (id, email, username, createdAt, updatedAt)
  - [ ] `FeedItem` (id, name, description, image, category, brand, productLink, tags, colors, price)
  - [ ] `Like` (userId, itemId, likedAt)
  - [ ] `Dislike` (userId, itemId, dislikedAt)
  - [ ] `Connection` (id, userId, friendId, createdAt)
  - [ ] `ChatMessage` (id, userId, role, content, image?, timestamp)

- [ ] **5.4 — Migrations**
  - [ ] Generate & run migrations for all tables
  - [ ] Set up `PrimaryGeneratedColumn` + timestamps

- [ ] **5.5 — Seed Data**
  - [ ] Seeder: insert 1 user + 20+ feed items (flowers, fashion, gifts)
  - [ ] Sample tags, colors, brands per item
  - [ ] Run seed on fresh DB

### Phase 6: Backend — Core Endpoints
- [ ] **6.1 — Feed Service + Controller**
  - [ ] `GET /api/feed?page=1&limit=20` → paginated FeedItems
  - [ ] No auth yet; returns all items

- [ ] **6.2 — Profile Service + Controller**
  - [ ] `GET /api/profile/:userId` → user + liked/disliked items
  - [ ] `POST /api/profile/like/:itemId` → create Like record
  - [ ] `POST /api/profile/dislike/:itemId` → create Dislike record
  - [ ] `DELETE /api/profile/like/:itemId` → remove Like
  - [ ] `DELETE /api/profile/dislike/:itemId` → remove Dislike

- [ ] **6.3 — Taste Service**
  - [ ] Compute: topColors, topStyles, topBrands, topCategories from likes
  - [ ] Called by profile controller
  - [ ] Returns TasteProfile (computed, not stored)

- [ ] **6.4 — Connection Service + Controller**
  - [ ] `GET /api/connections/:userId` → friend list
  - [ ] `POST /api/connections` (body: `{ userId, friendId }`) → create
  - [ ] `DELETE /api/connections/:id` → remove

- [ ] **6.5 — Chat Service + Controller**
  - [ ] `POST /api/chat` (body: `{ userId, friendId?, message }`) → mock response
  - [ ] `GET /api/chat/history/:userId` → paginated chat history
  - [ ] Save to DB; mock AI logic (rule-based for now)

### Phase 7: Integration — Frontend ↔ Backend
- [ ] **7.1 — API Client Setup**
  - [ ] `lib/api/client.ts` — axios or fetch wrapper
  - [ ] `lib/api/feed.ts`, `lib/api/profile.ts`, `lib/api/connections.ts`, `lib/api/chat.ts`
  - [ ] Error handling, loading states

- [ ] **7.2 — Replace Mock Data with API Calls**
  - [ ] Feed page: `useEffect(() => fetchFeed())` instead of mock
  - [ ] Profile page: fetch user profile + taste summary + connections
  - [ ] Chat page: fetch history, post messages
  - [ ] Persist userId in context or localStorage

- [ ] **7.3 — State Management**
  - [ ] Consider Context API or Zustand for user + feed state
  - [ ] Avoid prop drilling

- [ ] **7.4 — Testing + Refinement**
  - [ ] Test like/dislike round-trip
  - [ ] Test infinite scroll with real pagination
  - [ ] Test chat send/receive
  - [ ] Fix UI bugs, animations

---

### Phase 8: Auth (TODO — later)
- [ ] Implement JWT login/signup
- [ ] Protect backend routes with guards
- [ ] User context in frontend
- [ ] Redirect unauthenticated users

### Phase 9: AI Integration (TODO — later)
- [ ] OpenAI API integration in backend
- [ ] System prompt with taste profile context
- [ ] Friend-aware responses ("What would Alex like?")
- [ ] Image analysis (optional, for recommendations)

### Phase 10: Production (TODO — later)
- [ ] Cloud image storage (S3 / Cloudinary)
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway / Render / Fly.io)
- [ ] CI/CD pipeline, monitoring

---

**Version:** 2.0.0 — Next.js + NestJS + PostgreSQL
**Status:** Production foundation
