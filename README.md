# EduForge — Student Dashboard

A next-gen learning dashboard built for the Frontend Intern Challenge. Dark-mode only, Bento grid layout, live Supabase data, and Framer Motion animations throughout.

---

## Setup

### 1. Supabase

Create a free project at [supabase.com](https://supabase.com), open the **SQL Editor**, and run this:

```sql
CREATE TABLE courses (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT        NOT NULL,
  progress   INTEGER     NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  icon_name  TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO courses (title, progress, icon_name) VALUES
  ('Advanced React Patterns',     74, 'Code2'),
  ('System Design Fundamentals',  41, 'Network'),
  ('TypeScript Deep Dive',        88, 'FileCode2'),
  ('UI/UX Principles',            23, 'Palette');

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON courses FOR SELECT TO anon USING (true);
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your project's **Settings → API** page.

### 3. Run

```bash
npm install
npm run dev
```

---

## Architectural choices

### Why the layout is split the way it is

The outer shell (`Dashboard` in `page.tsx`) is a Server Component. It renders the sidebar and the grid structure immediately — no waiting on data. The only piece that actually needs the database is `CourseFeed`, so that's the only thing wrapped in `<Suspense>`. Everything else (`HeroTile`, `ActivityTile`) renders on the first pass while the course data is still in flight.

I could have made the entire page async and awaited the courses at the top level, but that would have blocked the whole UI until the DB responded. Splitting it out means users see the dashboard frame instantly and the course cards stream in.

### Server / client component split

The rule I followed: if it touches the database or has no interactivity, it stays a Server Component. If it needs `useState`, `useEffect`, or Framer Motion, it gets `'use client'`.

In practice that meant:
- `page.tsx`, `CourseFeed` — server (data fetching, no state)
- `Sidebar`, all tiles, `CourseCard` — client (animations, `usePathname`, `useState`)
- `lib/supabase.ts` — server-only module, never imported from a client component

One thing worth noting: props crossing the server → client boundary must be serializable. I ran into this when I tried passing a Lucide icon component directly as a prop from a Server Component to a client one — React threw immediately because functions aren't serializable. Fixed it by passing the icon name as a string and doing the lookup inside the client component (`CourseIcon.tsx`).

### Why `force-dynamic` on the dashboard page

Next.js will try to statically prerender any page it can at build time. The dashboard fetches live data that changes, so static prerendering makes no sense here. Adding `export const dynamic = 'force-dynamic'` tells Next.js to skip that and always server-render on demand.

### Animation approach

All entrance animations use `opacity` + `y` (transform), and hover states use `scale` — nothing that triggers layout recalculation. The progress bar uses `scaleX` instead of animating `width`, which keeps it off the layout thread entirely.

The stagger effect on course cards is done with incremental `delay` values (`0.05 + i * 0.07`) rather than a Framer Motion stagger container. This was deliberate — the cards are inside a `<Suspense>` boundary and mount after the rest of the page, so a container-level stagger would have already fired by the time they appeared. Per-card delays work cleanly regardless of when the component mounts.

For hover, I made sure the `transition` override lives inside `whileHover` itself (`whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}`). If you leave it in the top-level `transition` prop, the same delay that's used for the entrance animation technically applies to gesture animations too — Framer Motion ignores delays on gestures in practice, but being explicit is cleaner.

---

## Challenges

**Supabase client blowing up at build time**

`createClient` from `@supabase/supabase-js` validates the URL as soon as it's called. I originally had it at module scope, which meant Next.js threw during static page-data collection (before `.env.local` is loaded in that context). Moved it into a lazy `getClient()` function so it only runs when `fetchCourses` is actually called at request time.

**The server → client prop boundary**

Mentioned above, but it bit me twice. The second time was with the stub pages — I had a `ComingSoon` component that accepted a Lucide icon component as a prop, passed from a Server Component. Same serialization error. Ended up passing a string key and mapping it to the component inside the client component, which is the right pattern anyway.

**`loading.tsx` vs `<Suspense>` — which one does what**

These look like they do the same thing but they don't. `loading.tsx` kicks in during client-side *navigation* to a route — it wraps the whole page segment in a Suspense boundary at the route level. The `<Suspense>` I have around `CourseFeed` is more granular — it streams just the course section while the rest of the page is already visible. I kept both: `loading.tsx` handles the navigation case, `<Suspense>` handles the streaming case.

**Getting `transform-origin` right on the progress bar**

Framer Motion handles transforms via its own CSS variable system. Using Tailwind's `origin-left` class alone wasn't reliable across all cases, so I added a `.bar-fill` class in `globals.css` with an explicit `transform-origin: left center` to make sure the `scaleX` animation always grows from the left edge.
