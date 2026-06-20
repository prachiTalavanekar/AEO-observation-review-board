# AEO Observation Review Board

A production-ready web application that helps teams review how a brand appears in AI-generated answers (ChatGPT, Gemini, Claude, Perplexity) and convert those observations into actionable tasks.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Utilities & Types](#utilities--types)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Overview

AEO (Answer Engine Optimization) is the practice of optimizing a brand's presence in AI-generated answers. This tool allows marketing and SEO teams to:

- Document observations of how their brand (or competitors) appear in AI engine responses
- Track which AI surfaces are mentioning or missing their brand
- Generate rule-based action items to improve their AEO presence
- Maintain internal notes per observation for team collaboration
- Manage tasks with a simple Todo / Done workflow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| ORM / Client | Supabase JS Client v2 |
| Deployment | Vercel |
| Runtime | Node.js |

---

## Features

### Core Features

| # | Feature | Description |
|---|---|---|
| 1 | Create Observation | Form to log a brand's AI surface observation |
| 2 | Dashboard | View all observations with search and stats |
| 3 | Observation Details | Full view of a single observation |
| 4 | Generate Action Items | Rule-based AI action suggestions |
| 5 | Toggle Task Status | Mark action items as Todo or Done |
| 6 | Internal Notes | Save and update private team notes |
| 7 | Data Persistence | All data stored in Supabase, survives refresh |
| 8 | Search | Filter dashboard by brand name in real time |

### Dashboard Stats

- Total observations count
- Breakdown by AI surface: ChatGPT, Gemini, Claude, Perplexity

### Action Item Generation Logic

The app uses rule-based logic to generate action items:

**Always generated (for every observation):**
1. Add FAQ schema markup to improve AI answer eligibility
2. Improve website content to better match target query intent
3. Increase topical authority with in-depth content and backlinks

**Generated when competitors are listed:**
4. Create comparison pages against listed competitors

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with nav header
│   ├── page.tsx                    # Dashboard (Server Component)
│   ├── DashboardClient.tsx         # Dashboard UI with search (Client Component)
│   ├── globals.css                 # Tailwind CSS entry point
│   ├── not-found.tsx               # 404 page
│   └── observation/
│       ├── new/
│       │   └── page.tsx            # Create observation page
│       └── [id]/
│           └── page.tsx            # Observation detail page
│
├── components/
│   ├── ObservationForm.tsx         # Create observation form (Client)
│   ├── ObservationCard.tsx         # Dashboard card (Server)
│   ├── ActionItems.tsx             # Action items list with toggle (Client)
│   ├── NotesSection.tsx            # Internal notes editor (Client)
│   └── SearchBar.tsx               # Search input (Client)
│
├── lib/
│   └── supabase.ts                 # Supabase client singleton
│
├── types/
│   ├── observation.ts              # Observation TypeScript types
│   ├── actionItem.ts               # ActionItem TypeScript types
│   └── global.d.ts                 # CSS module declarations
│
└── utils/
    └── generateActionItems.ts      # Rule-based action item generator

supabase/
└── schema.sql                      # Full database schema with indexes & RLS policies
```

---

## Database Schema

### Table: `observations`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated unique identifier |
| `brand_name` | `text` | Name of the brand being observed |
| `website_url` | `text` | Brand's website URL |
| `target_query` | `text` | The query entered into the AI engine |
| `ai_surface` | `text` | One of: ChatGPT, Gemini, Claude, Perplexity |
| `observed_answer` | `text` | The full AI-generated answer that was observed |
| `competitor_names` | `text[]` | Array of competitor names mentioned in the answer |
| `internal_note` | `text` | Internal team notes (default empty string) |
| `created_at` | `timestamptz` | Auto-set on insert |

**Indexes:**
- `idx_observations_brand_name` — on `lower(brand_name)` for case-insensitive search
- `idx_observations_created_at` — on `created_at DESC` for ordered fetching

---

### Table: `action_items`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated unique identifier |
| `observation_id` | `uuid` (FK) | References `observations.id` (cascade delete) |
| `title` | `text` | The action item description |
| `status` | `text` | Either `todo` or `done` |
| `created_at` | `timestamptz` | Auto-set on insert |

**Indexes:**
- `idx_action_items_observation_id` — for fast lookup by observation

**Relationship:** One observation → many action items (one-to-many)

---

### Row Level Security (RLS)

Both tables have RLS enabled with open anon policies for public access:

```sql
CREATE POLICY "Allow all for anon" ON observations
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon" ON action_items
  FOR ALL TO anon USING (true) WITH CHECK (true);
```

> To add authentication, replace `anon` with `authenticated` and scope policies to `auth.uid()`.

---

## Pages & Routes

### `/` — Dashboard

- **Type:** Server Component + Client Component
- **Data:** Fetches all observations from Supabase on the server
- **Features:**
  - Stats bar: total observations + count per AI surface
  - Real-time search filter by brand name (client-side)
  - Observation cards grid (responsive: 1 → 2 → 3 columns)
  - Empty state with CTA when no observations exist

---

### `/observation/new` — Create Observation

- **Type:** Server page wrapper + Client form
- **Features:**
  - Brand name and website URL fields
  - Target query and AI surface selector (ChatGPT / Gemini / Claude / Perplexity)
  - Observed AI answer textarea
  - Competitor names: tag-based input (add with Enter key or Add button, remove with ×)
  - Optional internal note
  - On success: redirects to the new observation's detail page

---

### `/observation/[id]` — Observation Details

- **Type:** Server Component (data fetching) + Client Components (interactivity)
- **Data:** Fetches observation + action items in parallel from Supabase
- **Features:**
  - Full observation header: brand name, AI surface badge, URL, date
  - Target query and competitor tags
  - Full observed AI answer (formatted, left-bordered)
  - Action Items panel (client): generate, toggle Todo/Done, progress bar
  - Internal Notes panel (client): edit and save notes

---

## Components

### `ObservationForm.tsx` (Client)

Full form for creating a new observation. Handles:
- Controlled inputs for all fields
- Competitor tag add/remove with keyboard support
- Supabase insert on submit
- Loading state during save
- Redirect on success

---

### `ObservationCard.tsx` (Server-compatible)

Dashboard card displaying:
- Brand name + website URL
- AI surface badge (color-coded per platform)
- Target query preview (2-line clamp)
- Competitor tags (max 3 shown + overflow count)
- Creation date
- "View Details" link

**Badge colors:**
| Surface | Color |
|---|---|
| ChatGPT | Emerald green |
| Gemini | Blue |
| Claude | Orange |
| Perplexity | Purple |

---

### `ActionItems.tsx` (Client)

Displays action items for an observation:
- Progress bar showing completion percentage
- Generate button — calls rule-based generator and inserts to Supabase
- Each item: checkbox toggle, title, status badge (Todo/Done)
- Optimistic UI: updates state immediately on toggle
- Empty state prompt when no items exist

---

### `NotesSection.tsx` (Client)

Internal notes editor:
- Textarea pre-filled with existing note from DB
- Save button with loading state
- Green "Saved" confirmation badge (auto-hides after 2.5s)
- Updates `internal_note` field on the observation row

---

### `SearchBar.tsx` (Client)

Simple controlled search input with a magnifier icon. Filters the dashboard observation list in real time by brand name (case-insensitive).

---

## Utilities & Types

### `src/types/observation.ts`

```typescript
type AISurface = "ChatGPT" | "Gemini" | "Claude" | "Perplexity";

interface Observation {
  id: string;
  brand_name: string;
  website_url: string;
  target_query: string;
  ai_surface: AISurface;
  observed_answer: string;
  competitor_names: string[];
  internal_note: string;
  created_at: string;
}
```

---

### `src/types/actionItem.ts`

```typescript
type ActionItemStatus = "todo" | "done";

interface ActionItem {
  id: string;
  observation_id: string;
  title: string;
  status: ActionItemStatus;
  created_at: string;
}
```

---

### `src/utils/generateActionItems.ts`

Pure function that takes an `Observation` and returns an array of action item title strings based on rule-based logic. No AI API calls — fully deterministic and offline-capable.

```typescript
function generateActionItems(observation: Observation): string[]
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
```

Both variables are prefixed with `NEXT_PUBLIC_` so they are available in the browser (client components). They are safe to expose as long as RLS policies are correctly configured.

> **Never commit `.env.local` to version control.** It is listed in `.gitignore`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Run the RLS policy SQL:

```sql
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON observations FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON action_items FOR ALL TO anon USING (true) WITH CHECK (true);
```

4. Copy your **Project URL** and **anon key** from Settings → API Keys
5. Paste them into `.env.local`

### Build for Production

```bash
npm run build
npm run start
```

---

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the following environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Vercel auto-detects Next.js and configures the build correctly. Every push to `main` triggers a new deployment.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Future Enhancements

- **Authentication** — Add Supabase Auth to scope observations per user/team
- **AI-powered generation** — Replace rule-based logic with GPT/Claude API calls
- **Export** — Download observations as CSV or PDF
- **Notifications** — Email alerts when action items are overdue
- **Tags & filters** — Filter dashboard by AI surface, date range, competitor
- **Audit log** — Track changes to observations over time
