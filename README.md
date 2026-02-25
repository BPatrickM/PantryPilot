# 🛒 PantryPilot

**From meal idea to checkout — automatically.**

PantryPilot is a full-stack grocery automation app that turns your weekly meal selections into a live, populated shopping cart on ShopRite or Walmart. Select meals like a takeout menu, tell us how many people you're cooking for, check off what you already have, and we push everything to your cart.

---

## Features (MVP v1.1)

| Feature | Status |
|---|---|
| Takeout-style Meal Builder (Main / Sides / Dessert) | ✅ |
| Smart ingredient scaling formula | ✅ |
| Fuzzy pantry stock (icon + casual label + LOW flags) | ✅ |
| Text-paste recipe importer with NLP parser | ✅ |
| Saved Plan Library (Curated + User custom) | ✅ |
| Favorite & Most Used meal tracking | ✅ |
| AI cooking links (ChatGPT + Gemini, side-by-side) | ✅ |
| Walmart API cart integration | ✅ (needs API key) |
| ShopRite Playwright cart integration | ✅ (needs account) |
| BullMQ async cart push workers | ✅ |
| PostgreSQL schema + Supabase RLS | ✅ |

---

## Monorepo Structure

```
pantry-pilot/
├── apps/
│   ├── web/              # Next.js 14 web app
│   └── mobile/           # Expo React Native app
├── packages/
│   ├── core/             # Shared business logic (scaling, NLP parser, pantry, AI links, types)
│   └── db/               # PostgreSQL migrations + seed data
├── workers/
│   └── cart-worker/      # BullMQ worker (Walmart API + ShopRite Playwright)
├── turbo.json
└── .env.example
```

---

## Quick Start

### 1. Prerequisites

- Node.js >= 20
- PostgreSQL (or a free [Supabase](https://supabase.com) project)
- Redis (or a free [Upstash](https://upstash.com) instance)

### 2. Clone & Install

```bash
git clone https://github.com/BPatrickM/Pantry_Pilot.git
cd Pantry_Pilot
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase project → Settings → API |
| `SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |
| `WALMART_CLIENT_ID` | [Walmart Developer Portal](https://developer.walmart.com) |
| `WALMART_CLIENT_SECRET` | Walmart Developer Portal |
| `REDIS_URL` | Local Redis or Upstash |
| `ENCRYPTION_KEY` | Run: `openssl rand -hex 32` |

### 4. Set Up Database

```bash
# Apply schema + seed data to your Supabase project
psql $SUPABASE_URL -f packages/db/migrations/001_initial_schema.sql
psql $SUPABASE_URL -f packages/db/migrations/002_seed_data.sql
```

### 5. Run Development Servers

```bash
# Run everything (web + mobile + workers)
npm run dev

# Or run just the web app
cd apps/web && npm run dev
```

Web app: http://localhost:3000

---

## Scaling Formula

Every ingredient quantity is calculated as:

```
Q_final = Q_base × (N_diners / N_yield)
```

- `Q_base` — quantity as written in the recipe (for its default yield)
- `N_diners` — your headcount
- `N_yield` — the recipe's default serving count
- Result rounded to nearest 0.25 increment

Identical ingredients across multiple meals in the same week are **aggregated** into a single line before pantry deduction.

---

## Pantry Stock System

When you tap "I have this" on an ingredient, you pick one of four levels:

| Icon | Label | Internal Multiplier |
|---|---|---|
| 🟥 | Just a little left | 10% of standard package |
| 🟨 | About half | 50% of standard package |
| 🟩 | Almost full | 85% of standard package |
| ✅ | Plenty | 100% of standard package |

**LOW flag** — if your pantry covers < 25% of what's needed, the item gets a red LOW badge and the full quantity is added to your cart.

---

## Text-Paste Recipe Importer

Paste any recipe text (blog post, handwritten note, screenshot you typed out). The NLP parser runs four passes:

1. **Name extraction** — identifies the recipe title
2. **Yield detection** — finds "serves X" / "makes X" patterns  
3. **Ingredient parsing** — extracts quantity + unit + name per line
4. **Catalog matching** — fuzzy-matches to the ingredient catalog

Each line gets a confidence score. Green = auto-accepted. Amber = review suggested. Red = manual fix needed.

---

## Cart Integration

### Tier 1 — Walmart (Official API)
Uses Walmart's Open API for product search and cart add. Requires a Walmart Developer account.

### Tier 2 — ShopRite (Freshop + Playwright fallback)
Uses ShopRite's Freshop-backed endpoints for product search and cart population. Falls back to Playwright headless browser if Freshop fails.

> ⚠️ **Legal Note**: ShopRite integration via undocumented Freshop endpoints requires legal review. Pursue a formal data partnership before production launch.

---

## AI Cooking Links

Tap "Cook with AI" on any meal card. PantryPilot builds a pre-filled prompt and opens both:

- **ChatGPT** — `chat.openai.com/?q=...`
- **Gemini** — `gemini.google.com/app?q=...`

No API key required — uses browser deep-links.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Web | Next.js 14 (App Router) |
| Mobile | Expo (React Native) |
| Shared Logic | TypeScript packages (core) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Queue | BullMQ + Redis |
| Browser Automation | Playwright |
| Hosting | Railway.app |

---

## Roadmap

**Phase 2**
- OCR receipt scanning (Google Cloud Vision)
- Full preference engine (Cheapest / Organic / Generic)
- Smart pantry depletion tracking

**Phase 3**
- Kroger, Amazon Fresh, Instacart integrations
- AI meal recommendations
- Household collaboration
- Community plan sharing

---

## Contributing

PRs welcome. Please open an issue first for major changes.

---

## License

MIT
