# AEO Observation Review Board

## Overview

AEO Observation Review Board is a full-stack web application built with Next.js, Supabase, and Vercel. The application helps teams analyze how a brand appears in AI-generated search responses and convert those observations into actionable tasks.

Users can create observations, review details, track action items, and maintain internal notes. All information is stored in Supabase and persists across page refreshes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Database Client | @supabase/supabase-js v2 |
| Deployment | Vercel |
| Runtime | Node.js 18+ |

---

## Features

- **Create new AEO observations** — Log how a brand appears in AI-generated answers across ChatGPT, Gemini, Claude, and Perplexity
- **Dashboard displaying all observations** — View all observations in a responsive card grid with live stats by AI surface
- **Search by brand name** — Real-time client-side filtering on the dashboard
- **View detailed information for each observation** — Full observation page showing brand info, target query, competitors, and the observed AI answer
- **Generate action items from observations** — Rule-based generation of specific, relevant action items based on the observation data
- **Mark action items as Todo or Done** — Toggle status with a visual progress bar tracking completion
- **Save internal notes** — Write and update private team notes per observation with auto-save indication
- **Persistent storage using Supabase** — All data survives page refreshes and is stored in PostgreSQL
- **Responsive user interface** — Works across desktop, tablet, and mobile screen sizes

---

## Routes

| Route | Description |
|---|---|
| `/` | Dashboard — lists all observations with stats and search |
| `/observation/new` | Form to create a new observation |
| `/observation/[id]` | Detail page — full observation info, action items, and notes |

---

## Database Schema

### Table: `observations`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated unique ID |
| `brand_name` | `text` | Name of the brand being observed |
| `website_url` | `text` | Brand website URL |
| `target_query` | `text` | The query entered into the AI engine |
| `ai_surface` | `text` | One of: `ChatGPT`, `Gemini`, `Claude`, `Perplexity` |
| `observed_answer` | `text` | The full AI-generated answer that was observed |
| `competitor_names` | `text[]` | Array of competitor names mentioned in the answer |
| `internal_note` | `text` | Internal team notes (defaults to empty string) |
| `created_at` | `timestamptz` | Auto-set timestamp on insert |

### Table: `action_items`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Auto-generated unique ID |
| `observation_id` | `uuid` (FK) | References `observations.id` — cascades on delete |
| `title` | `text` | The action item description |
| `status` | `text` | Either `todo` or `done` |
| `created_at` | `timestamptz` | Auto-set timestamp on insert |

**Relationship:** One observation → many action items (one-to-many)

---

## Assumptions

- Authentication is intentionally omitted as specified in the assignment.
- AI-generated answers are manually provided by users.
- Competitor names are stored as an array.
- Internal notes are optional.
- Action items are generated using simple rule-based logic.
- All data is persisted using Supabase.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/prachiTalavanekar/AEO-observation-review-board.git
cd AEO-observation-review-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the Supabase database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`
3. Then run the following to enable public access (no auth):

```sql
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON observations FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON action_items FOR ALL TO anon USING (true) WITH CHECK (true);
```

4. Copy your **Project URL** and **anon key** from **Settings → API Keys** and paste into `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
npm run start
```

---

## Deploying to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repository
3. Add the following environment variables in Vercel under **Settings → Environment Variables**:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Click **Deploy**

---

## AI Usage

### Tools Used

- **ChatGPT**
- **Claude AI** 
- **Antigravity (Kiro)**

### What AI Helped With

- Understanding the project requirements
- Collecting information about Next.js, Supabase, and Vercel
- Planning the database schema and application flow
- Exploring different approaches and best practices
- Generating the initial code and components using Antigravity

### What I Changed or Rejected

- Modified the generated code to match the assignment requirements
- Improved the UI and component structure for better readability
- Added form validation and adjusted the data flow
- Refined the implementation to ensure proper data persistence with Supabase

---

## One Issue or Bug Fixed

During development, I encountered several issues including internal server errors, invalid Tailwind CSS classes, and Supabase-related errors while saving and updating data. I reviewed the generated code, corrected the database queries, fixed the styling issues, and ensured that data updates were properly reflected after page refreshes.

---

## What I Would Improve With More Time

- Add authentication and user management
- Implement search and filtering
- Add observation scoring and analytics
- Generate smarter action items using AI
- Improve mobile responsiveness and accessibility
- Add dashboard insights and pagination for better usability
