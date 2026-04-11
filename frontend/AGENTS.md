# THE_LOTUS_UNION — Product Skill Document (v2)

> **Purpose:** Full specification for building THE_LOTUS_UNION — a style and gift curation platform with Next.js frontend, NestJS backend, and PostgreSQL database.

---

## Project Overview

**THE_LOTUS_UNION** is a style-curation platform where users discover flowers, fashion, and gifts through a Pinterest-style visual feed. Users heart or dismiss items to build a personal taste profile. An AI chat assistant uses those profiles to recommend gifts for yourself or friends.

**Core Idea:** Taste is personal. THE_LOTUS_UNION learns yours — and your friends' — so you never have to guess again.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16+ · TypeScript · Tailwind CSS v4 | SSR/SSG, React components, API calls |
| **Backend** | NestJS · TypeScript | REST API, business logic, database ORM |
| **Database** | PostgreSQL · TypeORM | User profiles, feed items, connections, chat history |
| **Images** | Local assets now → Cloudinary / S3 later | Stored in `public/images/` for development |
| **AI** | TODO — OpenAI API | Text + image chat only, no voice, backend service |

**Architecture:** Strict frontend/backend separation.
- **Frontend** (Next.js): Pages, components, client-side state. Calls backend REST API via `fetch` or a thin API client layer.
- **Backend** (NestJS): REST controllers, services, TypeORM entities. All business logic lives here.
- **Database** (PostgreSQL): Single source of truth. No localStorage for persistent data.

---

## Pages (4 Core Views)

### 1. Feed — `/feed` (default route)

Main experience. Pinterest-style masonry grid of curated items.

**Layout:**
- **Mobile:** 2 columns
- **Tablet:** 3 columns
- **Desktop:** 4–5 columns (Pinterest-style masonry)

**Each card:**
- Full image only (variable height, like Pinterest) — **no item name or brand text on the card**
- Small X button (bottom-left-center) and heart button (bottom-right-center) overlaid on the image
- Buttons centered horizontally at bottom of card, sized for easy tapping but not oversized
- No hover overlay with name/brand — keep it clean, image-only

**Interaction — the disappear effect:**
1. User taps heart or X on any card
2. Card fades out + scales down (200ms ease-out)
3. Cards below in that column shift up smoothly to fill the gap
4. New items lazy-load at the bottom as the user scrolls (infinite scroll)
5. Heart → `POST /api/profile/like/:itemId`
6. X → `POST /api/profile/dislike/:itemId`

**Important:** All cards have the **same width** within each column, but **variable height** based on the natural image ratio. This creates the organic Pinterest look without feeling messy.

**Navigation:**
- Bottom nav bar (fixed, Instagram-style):
  - **Feed** (left) — masonry grid
  - **Chat** (center-left) — AI assistant
  - **Connections** (center-right) — friends list
  - **Profile** (right) — taste dashboard

### 2. Chat — `/chat`

Messenger-style AI assistant (Facebook Messenger / Instagram DMs feel).

**Layout:**
- Full-height chat with message bubbles
- User messages: right-aligned, light background
- AI messages: left-aligned, dark/glass background
- Text input + send button at bottom
- Optional: image upload button (for "is this good for Alex?")

**Behavior:**
- Ask for yourself: *"What flowers for a dinner party at X price?"*
- Ask for a connected friend: *"What would Alex like for her birthday?"*
- AI uses the relevant person's **taste profile** (likes, colors, styles, brands) to respond
- `POST /api/chat` sends message → backend calls OpenAI (TODO) → returns response based on taste data

**AI Integration (TODO):**
- For now: backend returns mock responses based on taste profile
- Later: OpenAI API call with system prompt containing the person's taste profile
- No voice. Text only. **No access to friend's full feed — only their aggregated taste preferences.**

### 3. Connections — `/connections`

Dedicated page for managing friend connections.

**Layout:**
- Friends list at top — each friend shows **only their profile picture and username**
- **No preference data, no liked/disliked items visible** to the user
- Search bar to find and add friends by username
- Remove friend via swipe or tap menu

**Behavior:**
- Search by username → results show profile picture + username → tap to connect
- Once connected, the AI assistant in chat can access that friend's taste profile for recommendations
- To get recommendations for a friend → go to chat and ask the AI

### 4. Profile — `/profile`

Taste dashboard — your personal history.

**Sections:**

#### A. Taste Timeline — Two Tabs
Like Instagram's saved/tagged tab switcher:
- **Liked tab** — Masonry grid of all items you hearted, reverse-chronological
- **Dismissed tab** — Masonry grid of all items you X'd, reverse-chronological
- Tap an item to undo the action (un-like or un-dismiss)

---

## API Endpoints (NestJS Backend)

### Feed
- `GET /api/feed?page=1&limit=20` → `FeedItem[]`
- `GET /api/feed/:id` → `FeedItem`

### Profile
- `GET /api/profile` → `UserProfile` (current user)
- `GET /api/profile/:userId/taste` → `TasteProfile` (computed)
- `POST /api/profile/like/:itemId` → `{ success: true }`
- `POST /api/profile/dislike/:itemId` → `{ success: true }`
- `DELETE /api/profile/like/:itemId` → undo like
- `DELETE /api/profile/dislike/:itemId` → undo dislike

### Chat
- `POST /api/chat` → `ChatMessage` (AI response)
- `GET /api/chat/history?limit=50` → `ChatMessage[]`

### Connections
- `GET /api/connections` → `Connection[]`
- `POST /api/connections` → `Connection` (add friend)
- `DELETE /api/connections/:id` → `{ success: true }`
- `GET /api/connections/search?username=<query>` → `UserProfile[]` (search users by username)
- `GET /api/connections/:id/taste` → `TasteProfile` (friend's computed taste — used by AI only, not exposed to user)

### Auth (TODO — later)
- `POST /api/auth/signup` → `{ token, user }`
- `POST /api/auth/login` → `{ token, user }`

---

## Database Schema (PostgreSQL / TypeORM)

```sql
-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- feed_items (products / curated content)
CREATE TABLE feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,       -- 'flower' | 'fashion' | 'gift' | 'accessory'
  brand VARCHAR(100),
  product_link VARCHAR(500),
  tags JSON,                            -- ["elegant", "minimal", "romantic"]
  colors JSON,                          -- ["pink", "white", "navy"]
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_likes
CREATE TABLE user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- user_dislikes
CREATE TABLE user_dislikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  disliked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- connections (friends)
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE SET NULL,
  friend_name VARCHAR(100),             -- fallback for unregistered friends
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- chat_messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,            -- 'user' | 'assistant'
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Data Models (TypeScript — shared types)

```typescript
// Feed Item
interface FeedItem {
  id: string;
  name: string;
  description: string;
  image: string;                         // URL or path
  category: 'flower' | 'fashion' | 'gift' | 'accessory';
  brand: string;
  productLink: string;
  tags: string[];                        // "elegant", "bold", "minimal"
  colors: string[];                      // "pink", "navy", "white"
  price?: number;
  currency?: string;
}

// User Profile
interface UserProfile {
  id: string;
  email: string;
  username: string;
  liked: { itemId: string; likedAt: string }[];
  disliked: { itemId: string; dislikedAt: string }[];
}

// Taste Profile (computed at runtime, not stored)
interface TasteProfile {
  userId: string;
  topColors: string[];
  topStyles: string[];
  topBrands: string[];
  topCategories: string[];
  likedCount: number;
  dislikedCount: number;
}

// Connection
interface Connection {
  id: string;
  userId: string;
  friendId?: string;                     // null if friend hasn't signed up
  friendName: string;
  createdAt: string;
}

// Chat Message
interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  suggestions?: FeedItem[];              // AI can attach item recommendations
  timestamp: string;
}
```

---

## Project Structure

Two separate projects (can be monorepo or separate repos):

```
frontend/               (Next.js)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout + bottom nav
│   │   ├── page.tsx                  # Redirect to /feed
│   │   │
│   │   ├── feed/
│   │   │   ├── page.tsx              # Feed page
│   │   │   └── components/
│   │   │       ├── MasonryGrid.tsx   # Responsive masonry layout
│   │   │       └── FeedCard.tsx      # Image + heart/X overlay
│   │   │
│   │   ├── chat/
│   │   │   ├── page.tsx              # Chat page
│   │   │   └── components/
│   │   │       ├── ChatBubble.tsx    # Message bubble
│   │   │       └── ChatInput.tsx     # Text input + send
│   │   │
│   │   ├── connections/
│   │   │   ├── page.tsx              # Connections page
│   │   │   └── components/
│   │   │       ├── FriendList.tsx    # Connected friends list
│   │   │       └── UsernameSearch.tsx # Search + add friend
│   │   │
│   │   └── profile/
│   │       ├── page.tsx              # Profile page
│   │       └── components/
│   │           └── TasteTimeline.tsx  # Liked/Dismissed tabs
│   │
│   ├── lib/
│   │   ├── api/                      # API client functions
│   │   │   ├── feed.ts              # getFeed, getFeedItem
│   │   │   ├── profile.ts          # getProfile, like, dislike
│   │   │   ├── chat.ts             # sendMessage, getHistory
│   │   │   └── connections.ts      # getConnections, add, remove
│   │   ├── types/                    # Shared TypeScript interfaces
│   │   │   ├── feed.ts
│   │   │   ├── user.ts
│   │   │   ├── chat.ts
│   │   │   └── connection.ts
│   │   └── utils/
│   │       └── time-ago.ts          # Relative date formatting
│   │
│   ├── components/                   # Shared components
│   │   ├── BottomNav.tsx
│   │   └── Loading.tsx
│   │
│   └── styles/
│       └── globals.css               # Tailwind directives + theme
│
├── public/
│   └── images/
│       ├── feed/                     # Feed item images (dev only)
│       └── backgrounds/              # Page backgrounds
│
├── next.config.ts
├── tailwind.config.ts
├── .env.local                        # NEXT_PUBLIC_API_URL
└── package.json


backend/                (NestJS)
├── src/
│   ├── main.ts                       # Bootstrap + CORS
│   ├── app.module.ts                 # Root module
│   │
│   ├── feed/
│   │   ├── feed.module.ts
│   │   ├── feed.controller.ts        # GET /api/feed
│   │   ├── feed.service.ts
│   │   ├── entities/
│   │   │   └── feed-item.entity.ts   # TypeORM entity
│   │   └── dto/
│   │       └── feed-query.dto.ts     # Pagination params
│   │
│   ├── profile/
│   │   ├── profile.module.ts
│   │   ├── profile.controller.ts     # GET/POST/DELETE profile, like, dislike
│   │   ├── profile.service.ts
│   │   ├── taste.service.ts          # Compute TasteProfile
│   │   └── entities/
│   │       ├── user.entity.ts
│   │       ├── user-like.entity.ts
│   │       └── user-dislike.entity.ts
│   │
│   ├── chat/
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts        # POST /api/chat, GET history
│   │   ├── chat.service.ts           # Mock now → OpenAI later
│   │   └── entities/
│   │       └── chat-message.entity.ts
│   │
│   ├── connection/
│   │   ├── connection.module.ts
│   │   ├── connection.controller.ts
│   │   ├── connection.service.ts
│   │   └── entities/
│   │       └── connection.entity.ts
│   │
│   ├── auth/                         # TODO — later
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── database/
│   │   ├── database.module.ts        # TypeORM config
│   │   └── seeds/
│   │       └── seed.ts               # Seed feed_items + demo users
│   │
│   └── config/
│       └── configuration.ts          # Env vars
│
├── docker-compose.yml                # PostgreSQL container
├── .env                              # DB_HOST, DB_PORT, OPENAI_API_KEY
├── nest-cli.json
└── package.json
```

---

## Feed — Detailed Behavior

### Masonry Layout
- Tailwind-based layout (CSS `columns` or a React masonry library — **no raw CSS unless Tailwind cannot solve it**)
- Images have variable heights — loaded naturally, no forced aspect ratio
- **Same width** per column, **variable height** per card — organic Pinterest feel
- Columns: 2 (mobile) → 3 (tablet) → 4–5 (desktop)

### Card Anatomy
```
┌──────────────────┐
│                   │
│      IMAGE        │    ← variable height, natural ratio
│                   │
│    [X]    [♡]     │    ← centered left/right at bottom, comfortably tappable
└──────────────────┘
```
No item name. No brand text. Image only + action buttons.

### Disappear Effect (on heart or X)
1. User taps heart or X
2. Card: `opacity-0`, `scale-95`, collapse height over ~250ms (Tailwind transitions)
3. Tailwind transition collapses the space — cards below slide up
4. After animation completes, card is removed from DOM
5. API call fires: `POST /api/profile/like/:itemId` or `dislike/:itemId`
6. Infinite scroll loads more items at the bottom

### Infinite Scroll
- `IntersectionObserver` on a sentinel element at bottom
- Load next page: `GET /api/feed?page=N&limit=20`
- Append to existing items array
- Subtle loading spinner at bottom while fetching

---

## Profile — Detailed Behavior

### Taste Timeline — Two Tabs
Like Instagram's saved/tagged tab switcher:
- **Liked tab** — masonry grid of hearted items, reverse-chronological
- **Dismissed tab** — masonry grid of X'd items, reverse-chronological
- Tap an item to undo the action (un-like or un-dismiss, calls `DELETE /api/profile/like/:itemId` or `DELETE /api/profile/dislike/:itemId`)

---

## Connections — Detailed Behavior

### Friends List
- Each friend: **profile picture + username only**
- **No preference data visible**, no liked/disliked items shown
- Remove friend via swipe or tap menu

### Add Friend
- Search bar at top of connections page
- Type a username → live search results
- Each result: profile picture + username
- Tap to send connection request
- Once connected → AI assistant in chat can use their taste profile

---

## Design Language

### Aesthetic
- **Simple, elegant, clean** — spring and lotus-inspired
- Inspired by: Pinterest layout, Instagram navigation, Aesop/Glossier minimalism
- No emoji in UI. No bright primary colors. No clutter.
- Think lotus pond on a spring morning — natural, airy, calming

### Color Palette
- **Background:** `#F8FAF5` (soft spring off-white with a green tint)
- **Surface:** `#FFFFFF` with subtle shadow
- **Text primary:** `#1A1A1A` (near-black)
- **Text secondary:** `#7A8A7A` (sage gray)
- **Accent primary:** `#A8C5A0` (soft sage green — spring leaves)
- **Accent secondary:** `#F2C6D0` (soft petal pink — lotus blossom)
- **Heart active:** `#E8A0B0` (lotus pink)
- **X active:** `#B0B8B0` (muted gray-green)

### Typography
- Headings: light weight, wide letter-spacing, uppercase
- Body: regular weight, comfortable line-height
- Small details: lighter color, extra tracking

### Components
- Cards: no borders, soft shadow, rounded-lg
- Buttons: ghost style or subtle fill, never loud
- Transitions: 200–300ms ease, never jarring (Tailwind transition utilities)
- Glass-morphism: sparingly, on overlays and chat bubbles
- **Tailwind CSS v4 only** — no raw CSS unless Tailwind cannot resolve the issue

### Code Quality
- Write **sustainable, production-level code**
- Clean architecture, proper TypeScript typing, reusable components
- No shortcuts, no hacks, no magic numbers
- Every component should be testable and maintainable

---

## Implementation Phases

### Phase 1: Frontend Scaffold + Foundation
- [ ] **1.1 — Project Setup**
  - [ ] Next.js 16+ with TypeScript + Tailwind v4
  - [ ] Directory structure: `app/`, `lib/`, `components/`, `types/`
  - [ ] Global styles + design tokens (colors, spacing, typography)
  - [ ] `.env.local` with `NEXT_PUBLIC_API_URL` placeholder

- [ ] **1.2 — Routing + Navigation**
  - [ ] `/feed`, `/chat`, `/connections`, `/profile` routes
  - [ ] BottomNav component (4 icons: feed, chat, connections, profile)
  - [ ] Layout wrapper with nav + padding
  - [ ] Active route highlighting

### Phase 2: Frontend — Feed Page
- [ ] **2.1 — Feed Layout + Masonry Grid**
  - [ ] MasonryGrid component (responsive: 2 col mobile → 4–5 col desktop)
  - [ ] Same width per column, variable height based on natural image ratio
  - [ ] Tailwind-based layout (use CSS columns or masonry lib, no raw CSS unless necessary)
  - [ ] Mock feed data in `lib/data/feedMock.ts` (20+ items)

- [ ] **2.2 — Feed Card Component**
  - [ ] FeedCard: image only, no name/brand text on card
  - [ ] X button (left-center bottom) and heart button (right-center bottom)
  - [ ] Buttons sized for easy tapping but not oversized
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
  - [ ] Stats: total likes, total dismissed
  - [ ] Edit button (placeholder for later)

- [ ] **3.2 — Taste Timeline — Two Tabs**
  - [ ] **Liked tab** — masonry grid of hearted items (reverse-chronological)
  - [ ] **Dismissed tab** — masonry grid of X'd items (reverse-chronological)
  - [ ] Tab switcher (like Instagram saved/tagged)
  - [ ] Tap item to undo (un-like or un-dismiss)
  - [ ] Read from local state

### Phase 3b: Frontend — Connections Page
- [ ] **3.3 — Friends List**
  - [ ] List of connected friends (profile picture + username only)
  - [ ] No preference data visible
  - [ ] Remove friend (swipe or tap menu)

- [ ] **3.4 — Add Friend**
  - [ ] Search bar to find users by username
  - [ ] Search results show profile picture + username
  - [ ] Tap to send connection request
  - [ ] Mock data for now

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

## Quick Start

```bash
# ── Frontend ──
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
# → http://localhost:3000

# ── Backend (separate terminal) ──
npx @nestjs/cli new backend
cd backend
npm install @nestjs/typeorm typeorm pg @nestjs/config class-validator class-transformer

# ── Database ──
cat > docker-compose.yml << 'DOCKER'
version: '3'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: THE_LOTUS_UNION
      POSTGRES_PASSWORD: THE_LOTUS_UNION
      POSTGRES_DB: THE_LOTUS_UNION
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
DOCKER

docker-compose up -d
npm run start:dev
# → http://localhost:3001
```

---

## Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=THE_LOTUS_UNION
DB_PASSWORD=THE_LOTUS_UNION
DB_DATABASE=THE_LOTUS_UNION

# TODO — add when AI is ready
# OPENAI_API_KEY=sk-...
```

---

**Version:** 2.0.0 (Next.js + NestJS + PostgreSQL)
**Last Updated:** April 7, 2026
**Status:** Production foundation — full-stack architecture
